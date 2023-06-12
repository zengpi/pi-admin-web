<script setup lang="ts" name="StartProcessDialog">
import { ref, onMounted, computed, markRaw, defineAsyncComponent } from "vue";

import { ElForm, ElMessage } from "element-plus";
import { CircleCheck, RefreshLeft } from "@element-plus/icons-vue";

import router from "@/router";

import { startProcessInstance } from "@/api/process-center/process-instance";
import { getProcessDefinitionForm } from "@/api/process-management/process-definition";
import { getBpmnXml } from "@/api/process-management/process-definition";
import { ProcessForm } from "@/model/process-center";
import ProcessViewer from "@/components/workflow/ProcessViewer.vue";

const formComponents = import.meta.glob("@/components/workflow/form/**/*.vue");

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    processDefinitionId: string;
  }>(),
  {
    dialogVisible: false,
  }
);

const title = `发起流程`;
const formRef = ref(ElForm);
const submitBtnLoading = ref(false);

const form = ref<ProcessForm>(new ProcessForm());

const collapseActiveNames = ref(["1", "2", "3"]);

const bpmnXml = ref("");

const dialogVisible = computed({
  get() {
    return props.dialogVisible;
  },
  set(value) {
    emit("update:dialogVisible", value);
  },
});

onMounted(() => {
  getProcessDefinitionForm(props.processDefinitionId)
    .then(({ data }) => {
      data.formComponent = markRaw(
        defineAsyncComponent(
          formComponents[
            `/src/components/workflow/form/${data.componentPath}.vue`
          ] as any
        )
      );
      form.value = data;
    })
    .catch((err) => {
      console.error(err);
    });
  getBpmnXml(props.processDefinitionId)
    .then(({ data }) => {
      bpmnXml.value = data;
    })
    .catch((err) => {
      console.error(err);
    });
});

function closeDialog() {
  dialogVisible.value = false;
}

async function handleSubmit() {
  if (!formRef.value) return;
  await formRef.value.form.validate((valid: boolean) => {
    if (valid) {
      startProcessInstance(
        props.processDefinitionId,
        formRef.value.formData
      ).then(() => {
        ElMessage.success("提交成功");
        closeDialog();
        router.push({ path: "/process/process-center/my-process" });
      });
    }
  });
}

function handleReset() {
  if (!formRef.value) return;
  formRef.value.form.resetFields();
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    draggable
    :title="title"
    :before-close="closeDialog"
    width="80%"
    fullscreen
  >
    <el-collapse v-model="collapseActiveNames">
      <el-collapse-item title="表单信息" name="2">
        <el-card shadow="hover">
          <template #header>
            <span>{{ form.name }}</span>
          </template>
          <component
            ref="formRef"
            v-if="form.formComponent"
            :is="form.formComponent"
            :form-data="form.formData"
          >
          </component>
        </el-card>
        <el-row
          :gutter="10"
          type="flex"
          justify="center"
          style="margin-top: 20px"
        >
          <el-col :span="1.5">
            <el-button
              :icon="CircleCheck"
              type="success"
              @click="handleSubmit"
              :loading="submitBtnLoading"
              >提交</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button :icon="RefreshLeft" type="primary" @click="handleReset"
              >重置</el-button
            >
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="流程" name="3">
        <ProcessViewer v-if="bpmnXml" :bpmn-xml="bpmnXml" />
      </el-collapse-item>
    </el-collapse>
  </el-dialog>
</template>
