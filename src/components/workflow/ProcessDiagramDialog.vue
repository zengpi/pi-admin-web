<script setup lang="ts" name="ProcessDiagramDialog">
/**
 * 流程图
 * @author ZnPi
 * @date 2023-04-01
 */
import { computed, onMounted, ref } from "vue";

import { getBpmnXml } from "@/api/process/process-management/process-definition";

import ProcessViewer from "@/components/workflow/ProcessViewer.vue";

const emits = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    processId: string;
  }>(),
  {
    dialogVisible: false,
  }
);

const title = "流程图";
const bpmnXml = ref<string>();

const dialogVisible = computed({
  get() {
    return props.dialogVisible;
  },
  set(value) {
    emits("update:dialogVisible", value);
  },
});

onMounted(() => {
  getBpmnXml(props.processId)
    .then(({ data }) => {
      bpmnXml.value = data;
    })
    .catch();
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    draggable
    :title="title"
    :before-close="() => (dialogVisible = false)"
    width="60%"
  >
    <ProcessViewer v-if="bpmnXml" :bpmn-xml="bpmnXml" />
  </el-dialog>
</template>
