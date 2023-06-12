<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import type { ElTree } from "element-plus";
import { CircleCheck } from "@element-plus/icons-vue";
import type { TreeNodeData } from "element-plus/es/components/tree/src/tree.type";

import { getMenuSelectTree } from "@/api/system/menu";

import type { ComponentProps, SelectTree } from "@/model";

const emit = defineEmits<{
  (e: "submit", menuIds: number[]): void;
}>();

const props = defineProps<{
  componentProps: ComponentProps;
  menuIds: number[];
}>();

const treeRef = ref<InstanceType<typeof ElTree>>();

const treeData = ref<Array<SelectTree>>();

const filterText = ref("");

watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

watch(
  () => props.menuIds,
  () => {
    treeRef.value!.setCheckedKeys(props.menuIds);
  }
);

const filterNode = (value: string, data: TreeNodeData): boolean => {
  if (!value) return true;
  return data.label!.includes(value);
};

const handleConfirm = () => {
  const nodes = treeRef.value!.getCheckedNodes(false, true);
  emit(
    "submit",
    nodes.map((e) => e.value)
  );
};

onMounted(() => {
  getMenuSelectTree(true).then(({ data }) => {
    treeData.value = data;
  });
});
</script>

<template>
  <div>
    <div>
      <el-input class="filter" v-model="filterText" placeholder="关键词" />
      <el-button type="primary" :icon="CircleCheck" @click="handleConfirm"
        >提交
      </el-button>
    </div>

    <el-tree
      ref="treeRef"
      show-checkbox
      :data="treeData"
      node-key="value"
      :filter-node-method="filterNode"
    />
  </div>
</template>

<style scoped lang="scss">
.filter {
  width: 84%;
  margin-right: 5px;
}
</style>
