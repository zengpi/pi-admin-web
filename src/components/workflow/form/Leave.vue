<script setup lang="ts" name="Leave">
/**
 * 员工请假表单
 * @author ZnPi
 * @date 2023-04-03
 */
import { onMounted, ref } from "vue";

import { ElForm, ElMessage, type FormRules } from "element-plus";
import { Search } from "@element-plus/icons-vue";

import { LeaveFormData } from "@/model/components/workflow/form";
import { OptionalUserDialog, type OptionalUser } from "@/model/system/user";

import OptionalUserVue from "@/views/system/user/OptionalUser.vue";

const props = withDefaults(
  defineProps<{
    formData?: Object;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

const form = ref(ElForm);
const formData = ref<LeaveFormData>(new LeaveFormData());

const rules = ref<FormRules>({
  username: [{ required: true, message: "工号不能为空", trigger: "blur" }],
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  time: [{ required: true, message: "请选择请假时间", trigger: "blur" }],
  durationDay: [{ required: true, message: "请输入累计时间", trigger: "blur" }],
  candidateNames: [
    { required: true, message: "请选择部门领导", trigger: "blur" },
  ],
  reason: [{ required: true, message: "请输入请假事由", trigger: "blur" }],
});

const typeOptions = [
  {
    label: "事假",
  },
  {
    label: "出差",
  },
  {
    label: "年假",
  },
  {
    label: "补休",
  },
  {
    label: "工伤",
  },
  {
    label: "病假",
  },
  {
    label: "工卡问题",
  },
  {
    label: "产假",
  },
  {
    label: "婚假",
  },
  {
    label: "陪产假",
  },
  {
    label: "丧假",
  },
];

const optionalUserDialog = ref(new OptionalUserDialog());

const userSelectType = ref("user");

onMounted(() => {
  if (props.formData) {
    formData.value = props.formData;
  }
});

function handleSelectUser() {
  optionalUserDialog.value.dialogVisible = true;
  userSelectType.value = "user";
}

function handleAgentSelect() {
  optionalUserDialog.value.dialogVisible = true;
  userSelectType.value = "agent";
}

function handleAssigneeSelect() {
  optionalUserDialog.value.dialogVisible = true;
  userSelectType.value = "candidate";
}

function handleSelect(users: OptionalUser[]) {
  if (userSelectType.value === "candidate") {
    formData.value.candidates = users.map((user) => user.username).join(",");
    formData.value.candidateNames = users.map((user) => user.name).join(",");
    return;
  }
  if (users.length > 1) {
    ElMessage.warning("选择了多个用户，只取其中一个");
  }
  const user = users[0];
  if (userSelectType.value === "user") {
    formData.value.username = user.username;
    formData.value.name = user.name;
    formData.value.deptName = user.deptName;
  } else if (userSelectType.value === "agent") {
    formData.value.agent = user.name;
  }
}

defineExpose({
  form,
  formData,
});
</script>

<template>
  <div>
    <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="工号" prop="username">
            <el-input
              v-model="formData.username"
              placeholder="请选择"
              readonly
              :disabled="disabled"
            >
              <template #append>
                <el-button
                  :icon="Search"
                  @click="handleSelectUser"
                  :disabled="disabled"
                />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name" readonly :disabled="disabled" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="部门" prop="deptName">
            <el-input
              v-model="formData.deptName"
              readonly
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="请假类型" prop="type">
            <el-select
              v-model="formData.type"
              class="m-2"
              filterable
              :disabled="disabled"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.label"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="请假时间" prop="time">
            <el-date-picker
              v-model="formData.time"
              type="datetimerange"
              range-separator="到"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="请假累计时间" prop="durationDate">
            <el-input-number
              v-model="formData.durationDate"
              :min="0"
              :disabled="disabled"
            />
            <span style="margin: 0 10px 0 10px">天</span>
            <el-input-number
              v-model="formData.durationHour"
              :min="0"
              :disabled="disabled"
            />
            <span style="margin: 0 10px 0 10px">小时</span>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="假期代理人" prop="agent">
            <el-input
              v-model="formData.agent"
              placeholder="请选择"
              readonly
              :disabled="disabled"
            >
              <template #append>
                <el-button
                  :icon="Search"
                  @click="handleAgentSelect"
                  :disabled="disabled"
                />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="部门领导审批" prop="candidateNames">
            <el-input
              v-model="formData.candidateNames"
              placeholder="请选择"
              readonly
              :disabled="disabled"
            >
              <template #append>
                <el-button
                  :icon="Search"
                  @click="handleAssigneeSelect"
                  :disabled="disabled"
                />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="请假事由" prop="reason">
            <el-input
              type="textarea"
              v-model="formData.reason"
              autocomplete="off"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <OptionalUserVue
      v-if="optionalUserDialog.dialogVisible"
      v-model:dialogVisible="optionalUserDialog.dialogVisible"
      @select="handleSelect"
    />
  </div>
</template>
