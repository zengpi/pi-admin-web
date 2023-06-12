<script setup lang="ts" name="ProcessDetail">
import { ref, onMounted, computed, markRaw, defineAsyncComponent } from "vue";

import { ElForm, ElMessage, type FormRules } from "element-plus";
import {
  Check,
  Clock,
  CircleCheck,
  ChatLineRound,
  SwitchFilled,
  ArrowLeft,
  CircleClose,
  Plus,
  RefreshLeft,
} from "@element-plus/icons-vue";

import { ProcessInstanceDetail } from "@/model/process-center/process-instance";

import { getProcessInstanceDetail } from "@/api/process-center/process-instance";
import {
  approve,
  delegate,
  getTaskForm,
  reject,
  transfer,
} from "@/api/process-center/process-task";

import type { ProcessForm } from "@/model/process-center";
import type {
  ApproveTask,
  ApproveCommon,
  ApproveReject,
} from "@/model/process-center/process-task";
import { OptionalUser, OptionalUserDialog } from "@/model/system/user";
import { APPROVE_BTN_TYPE } from "@/model/enums/components/workflow/process-detail";

import OptionalUserVue from "@/views/system/user/OptionalUser.vue";

import ProcessViewer from "@/components/workflow/ProcessViewer.vue";
const formComponents = import.meta.glob("@/components/workflow/form/**/*.vue");

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
  (e: "refresh"): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    isApproval?: boolean;
    taskId?: string;
    processInstanceId?: string;
  }>(),
  {
    dialogVisible: false,
    isApproval: false,
  }
);

const title = `流程详情`;
let approveBtnType: APPROVE_BTN_TYPE;

const approvalFormRef = ref(ElForm);
const formRef = ref(ElForm);

const collapseActiveNames = ref(["1", "2", "3", "4", "5"]);

const processInstanceDetail = ref<ProcessInstanceDetail>(
  new ProcessInstanceDetail()
);

const approvalForm = ref<{ comment: string }>({ comment: "" });
const rules = ref<FormRules>({
  comment: [{ required: true, message: "请输入审批意见", trigger: "blur" }],
});

const copyUsers = ref<OptionalUser[]>([]);
const nextUsers = ref<OptionalUser[]>([]);

const taskForm = ref<ProcessForm | null>(null);

const optionalUserDialog = ref(new OptionalUserDialog());

const dialogVisible = computed({
  get() {
    return props.dialogVisible;
  },
  set(value) {
    emit("update:dialogVisible", value);
  },
});

onMounted(() => {
  getProcessInstanceDetail(props.processInstanceId!).then(({ data }) => {
    processInstanceDetail.value = data;
    for (let form of processInstanceDetail.value.forms) {
      form.formComponent = markRaw(
        defineAsyncComponent(
          formComponents[
            `/src/components/workflow/form/${form.componentPath}.vue`
          ] as any
        )
      );
    }
  });
  if (props.taskId) {
    getTaskForm(props.taskId)
      .then(({ data }) => {
        taskForm.value = data;
        if (taskForm.value != null) {
          taskForm.value.formComponent = markRaw(
            defineAsyncComponent(
              formComponents[
                `/src/components/workflow/form/${taskForm.value.componentPath}.vue`
              ] as any
            )
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

function closeDialog() {
  dialogVisible.value = false;
}

function closeDialogAndRefresh() {
  closeDialog();
  emit("refresh");
}

function getIcon(endTime?: string) {
  if (endTime) {
    return Check;
  } else {
    return Clock;
  }
}

function getColor(endTime?: string) {
  if (endTime) {
    return "#2bc418";
  } else {
    return "#b3bdbb";
  }
}

function commentTagType(type: string | undefined) {
  switch (type) {
    case "1":
      return "success";
    case "2":
      return "warning";
    case "3":
      return "danger";
    case "4":
      return "";
    case "5":
      return "success";
    case "6":
      return "danger";
    case "7":
      return "info";
  }
}

function commentType(type: string | undefined) {
  switch (type) {
    case "1":
      return "通过";
    case "2":
      return "退回";
    case "3":
      return "驳回";
    case "4":
      return "委派";
    case "5":
      return "转办";
    case "6":
      return "终止";
    case "7":
      return "撤回";
  }
}

function handleReset() {
  if (formRef.value) {
    formRef.value.form.resetFields();
  }
  approvalFormRef.value.resetFields();
}

async function handleComplete() {
  if (taskForm.value && formRef) {
    await formRef.value.form.validate((valid: boolean) => {
      if (!valid) {
        return;
      }
    });
  }
  if (!approvalFormRef.value) return;
  approvalFormRef.value.validate((valid: boolean) => {
    if (valid) {
      let approveTask: ApproveTask = {
        taskId: props.taskId,
        processInstanceId: props.processInstanceId,
        comment: approvalForm.value.comment,
        variables: taskForm.value ? formRef.value.formData : undefined,
        copyUsers: copyUsers.value.map((copyUser) => copyUser.username!),
        nextUsers: nextUsers.value.map((nextUser) => nextUser.username!),
      };
      approve(approveTask).then(() => {
        ElMessage.success("审批完成");
        closeDialogAndRefresh();
      });
    }
  });
}

function handleDelegate() {
  if (!approvalFormRef.value) return;
  approvalFormRef.value.validate((valid: boolean) => {
    if (valid) {
      optionalUserDialog.value.dialogVisible = true;
      approveBtnType = APPROVE_BTN_TYPE.DELEGATE;
    }
  });
}

function handleTransfer() {
  if (!approvalFormRef.value) return;
  approvalFormRef.value.validate((valid: boolean) => {
    if (valid) {
      optionalUserDialog.value.dialogVisible = true;
      approveBtnType = APPROVE_BTN_TYPE.TRANSFER;
    }
  });
}

function handleReject() {
  if (!approvalFormRef.value) return;
  approvalFormRef.value.validate((valid: boolean) => {
    if (valid) {
      let approveReject: ApproveReject = {
        taskId: props.taskId!,
        processInstanceId: props.processInstanceId!,
        comment: approvalForm.value.comment,
        copyUsers: copyUsers.value.map((copyUser) => copyUser.username!),
      };
      reject(approveReject).then(() => {
        ElMessage.success("驳回成功");
        closeDialogAndRefresh();
      });
    }
  });
}

function handleSelectCopyUsers() {
  optionalUserDialog.value.dialogVisible = true;
  approveBtnType = APPROVE_BTN_TYPE.COPY;
}

function userSelect(rows: OptionalUser[]) {
  if (approveBtnType === APPROVE_BTN_TYPE.COPY) {
    let usernames = copyUsers.value.map((copyUser) => copyUser.username);
    rows.forEach((row) => {
      if (!usernames.includes(row.username)) {
        copyUsers.value.push(row);
      }
    });
  } else if (approveBtnType === APPROVE_BTN_TYPE.NEXT) {
    let usernames = nextUsers.value.map((nextUser) => nextUser.username);
    rows.forEach((row) => {
      if (!usernames.includes(row.username)) {
        nextUsers.value.push(row);
      }
    });
  } else if (approveBtnType === APPROVE_BTN_TYPE.DELEGATE) {
    if (rows.length !== 1) {
      ElMessage.error("只能指定一个委派人");
      return;
    }
    let delegateTask: ApproveCommon = {
      taskId: props.taskId!,
      processInstanceId: props.processInstanceId!,
      userName: rows[0].username!,
      comment: approvalForm.value.comment,
      copyUsers: copyUsers.value.map((copyUser) => copyUser.username!),
    };
    delegate(delegateTask).then(() => {
      ElMessage.success("委派成功");
      closeDialogAndRefresh();
    });
  } else if (approveBtnType === APPROVE_BTN_TYPE.TRANSFER) {
    if (rows.length !== 1) {
      ElMessage.error("只能指定一个转办人");
      return;
    }
    let transferTask: ApproveCommon = {
      taskId: props.taskId!,
      processInstanceId: props.processInstanceId!,
      userName: rows[0].username!,
      comment: approvalForm.value.comment,
      copyUsers: copyUsers.value.map((copyUser) => copyUser.username!),
    };
    transfer(transferTask).then(() => {
      ElMessage.success("转办成功");
      closeDialogAndRefresh();
    });
  }
}

function handleSelectNextUsers() {
  optionalUserDialog.value.dialogVisible = true;
  approveBtnType = APPROVE_BTN_TYPE.NEXT;
}

function handleClose(type: APPROVE_BTN_TYPE, item: OptionalUser) {
  if (type === APPROVE_BTN_TYPE.COPY) {
    copyUsers.value = copyUsers.value.filter(
      (user) => user.username !== item.username
    );
  } else if (type === APPROVE_BTN_TYPE.NEXT) {
    nextUsers.value = nextUsers.value.filter(
      (user) => user.username !== item.username
    );
  }
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :before-close="closeDialog"
    fullscreen
  >
    <el-collapse v-model="collapseActiveNames">
      <el-collapse-item title="表单信息" name="2">
        <template v-for="form in processInstanceDetail.forms" :key="form.id">
          <el-card shadow="hover">
            <template #header>
              <span>{{ form.name }}</span>
            </template>
            <component
              v-if="form.formComponent"
              :is="form.formComponent"
              :form-data="form.formData"
              :disabled="true"
            >
            </component>
          </el-card>
        </template>
        <el-card shadow="hover" v-if="taskForm != null">
          <template #header>
            <span>{{ taskForm.name }}</span>
          </template>
          <component
            ref="formRef"
            v-if="taskForm.formComponent"
            :is="taskForm.formComponent"
          >
          </component>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="审批" name="3" v-if="isApproval">
        <el-row>
          <el-col :span="20" :offset="2">
            <el-form
              ref="approvalFormRef"
              :model="approvalForm"
              :rules="rules"
              label-width="120px"
            >
              <el-form-item label="审批意见" prop="comment">
                <el-input
                  type="textarea"
                  :rows="5"
                  v-model="approvalForm.comment"
                  placeholder="请输入审批意见"
                />
              </el-form-item>
              <el-form-item label="抄送人" prop="copyUserIds">
                <el-tag
                  :key="index"
                  v-for="(item, index) in copyUsers"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(APPROVE_BTN_TYPE.COPY, item)"
                  style="margin-right: 5px"
                >
                  {{ item.name }}
                </el-tag>
                <el-button
                  type="primary"
                  class="button-new-tag"
                  :icon="Plus"
                  circle
                  @click="handleSelectCopyUsers"
                />
              </el-form-item>
              <el-form-item label="下一级审批人" prop="nextUserIds">
                <el-tag
                  :key="index"
                  v-for="(item, index) in nextUsers"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(APPROVE_BTN_TYPE.NEXT, item)"
                  style="margin-right: 5px"
                >
                  {{ item.name }}
                </el-tag>
                <el-button
                  type="primary"
                  class="button-new-tag"
                  :icon="Plus"
                  circle
                  @click="handleSelectNextUsers"
                />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row :gutter="10" type="flex" justify="center">
          <el-col :span="1.5" v-if="taskForm != null">
            <el-button :icon="RefreshLeft" type="info" @click="handleReset"
              >重置表单</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              :icon="CircleCheck"
              type="success"
              @click="handleComplete"
              >通过</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              :icon="ChatLineRound"
              type="primary"
              @click="handleDelegate"
              >委派</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              :icon="SwitchFilled"
              type="success"
              @click="handleTransfer"
              >转办</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button :icon="CircleClose" type="danger" @click="handleReject"
              >驳回</el-button
            >
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="日志" name="4">
        <el-timeline>
          <el-timeline-item
            v-for="(log, index) in processInstanceDetail.logs"
            :key="index"
            :icon="getIcon(log.endTime)"
            :color="getColor(log.endTime)"
          >
            <p style="font-weight: 700">{{ log.activityName }}</p>
            <el-card
              v-if="log.activityType === 'startEvent'"
              class="box-card"
              shadow="hover"
            >
              {{ log.assigneeName }} 在 {{ log.startTime }} 发起流程
            </el-card>
            <el-card
              v-if="log.activityType === 'userTask'"
              class="box-card"
              shadow="hover"
            >
              <el-descriptions
                :column="5"
                :labelStyle="{ 'font-weight': 'bold' }"
              >
                <el-descriptions-item label="实际办理">{{
                  log.assigneeName || "-"
                }}</el-descriptions-item>
                <el-descriptions-item label="候选办理">{{
                  log.candidate || "-"
                }}</el-descriptions-item>
                <el-descriptions-item label="接收时间">{{
                  log.startTime || "-"
                }}</el-descriptions-item>
                <el-descriptions-item label="办结时间">{{
                  log.endTime || "-"
                }}</el-descriptions-item>
                <el-descriptions-item label="耗时">{{
                  log.duration || "-"
                }}</el-descriptions-item>
              </el-descriptions>
              <div v-if="log.comments && log.comments.length > 0">
                <div v-for="(comment, index) in log.comments" :key="index">
                  <el-divider content-position="left">
                    <el-tag :type="commentTagType(comment.type)">{{
                      commentType(comment.type)
                    }}</el-tag>
                    <el-tag
                      type="info"
                      effect="plain"
                      style="margin-left: 5px"
                      >{{ comment.time }}</el-tag
                    >
                  </el-divider>
                  <span>{{ comment.fullMessage }}</span>
                </div>
              </div>
            </el-card>
            <el-card
              v-if="log.activityType === 'endEvent'"
              class="box-card"
              shadow="hover"
            >
              {{ log.startTime }} 结束流程
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-collapse-item>
      <el-collapse-item title="流程跟踪" name="5">
        <ProcessViewer
          v-if="processInstanceDetail.bpmnXml"
          :bpmn-xml="processInstanceDetail.bpmnXml"
          :logs="processInstanceDetail.logs"
          :viewer-element="processInstanceDetail.viewerElement"
        />
      </el-collapse-item>
    </el-collapse>
    <OptionalUserVue
      v-if="optionalUserDialog.dialogVisible"
      v-model:dialog-visible="optionalUserDialog.dialogVisible"
      @select="userSelect"
    />
  </el-dialog>
</template>
