<script setup lang="ts" name="DesignerDialog">
/**
 * 设计器弹窗
 * @author ZnPi
 * @date 2023-04-12
 */
import { computed, onMounted, ref } from "vue";

import { ElMessage, ElMessageBox } from "element-plus";

import { SaveModelDesign as SaveModelDesignModel } from "@/model/process-management/process-model";

import {
  getBpmnXml,
  saveModelDesign,
} from "@/api/process-management/process-model";

import ProcessDesigner from "@/components/workflow/process-designer/Index";

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    modelId: string | null;
    modelName: string | null;
  }>(),
  {
    dialogVisible: false,
  }
);

const title = `流程建模 - ${props.modelName}`;
const loading = ref(false);

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
  loading.value = true;
  getBpmnXml(props.modelId)
    .then(({ data }) => {
      bpmnXml.value = data;
      loading.value = false;
    })
    .catch(() => {
      loading.value = true;
    });
});

function closeDialog() {
  dialogVisible.value = false;
}

async function handleSave() {
  let newVersion = false;
  await ElMessageBox.confirm("是否将此模型保存为新版本？", "提示", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  })
    .then(() => {
      newVersion = true;
    })
    .catch(() => {});
  let model = new SaveModelDesignModel(
    props.modelId!,
    bpmnXml.value,
    newVersion
  );
  saveModelDesign(model)
    .then(() => {
      ElMessage.success("保存成功");
      closeDialog();
    })
    .catch((error) => {
      console.error(error);
    });
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :before-close="closeDialog"
    fullscreen
  >
    <ProcessDesigner v-if="!loading" v-model:xml="bpmnXml" @save="handleSave" />
  </el-dialog>
</template>
