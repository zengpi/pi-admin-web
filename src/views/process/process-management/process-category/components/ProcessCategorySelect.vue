<script setup lang="ts" name="ProcessCategorySelect">
import { ref, onMounted, computed } from "vue";

import { ElTable, ElMessage } from "element-plus";

import { BaseQuery } from "@/model";
import type { ProcessCategory } from "@/model/process-management/process-category";

import { getCategories } from "@/api/process-management/process-category";

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
  (e: "select", category: ProcessCategory): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
  }>(),
  {
    dialogVisible: false,
  }
);

const query = ref(new BaseQuery());

const table = ref(ElTable);
const tableData = ref<ProcessCategory[]>([]);
const loading = ref(false);

const dialogVisible = computed({
  get() {
    return props.dialogVisible;
  },
  set(value) {
    emit("update:dialogVisible", value);
  },
});

function loadData() {
  loading.value = true;

  getCategories(query.value)
    .then(({ data }) => {
      tableData.value = data.records!;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

onMounted(() => {
  loadData();
});

function closeDialog() {
  dialogVisible.value = false;
}

function handleComfirm() {
  let rows = table.value.getSelectionRows();
  if (rows.length !== 1) {
    ElMessage.error("请选择一条记录");
    return;
  }

  closeDialog();
  emit("select", rows[0]);
}

function handleRowDbClick(row: ProcessCategory) {
  closeDialog();
  emit("select", row);
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    draggable
    title="候选分类"
    :before-close="closeDialog"
    width="50%"
  >
    <div style="display: flex">
      <el-input
        v-model="query.keyWord"
        clearable
        placeholder="关键词..."
        class="query-item"
        style="width: auto; margin: 0 0 10px auto"
        @keyup.enter="loadData"
      />
    </div>
    <el-table
      ref="table"
      :data="tableData"
      v-loading="loading"
      row-key="id"
      @row-dblclick="handleRowDbClick"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column prop="code" label="分类编码" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="remark" label="备注" />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="handleComfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
