<script setup lang="ts">
/**
 * 待选租户
 * @author ZnPi
 * @date 2023-05-22
 */
import { onMounted, ref, computed } from "vue";

import { ElMessage, ElTable } from "element-plus";
import { RefreshLeft, Search } from "@element-plus/icons-vue";

import { Package, PackageQuery } from "@/model/system/package";

import { getPackages } from "@/api/system/package";
import { StateEnum } from "@/model/enums";

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
  (e: "select", optionalPackages: Array<Package>): void;
}>();

const props = defineProps<{
  dialogVisible: boolean;
}>();

const title = `候选套餐`;

const query = ref(new PackageQuery(StateEnum.ENABLED));

const table = ref(ElTable);
const tableData = ref<Array<Package>>([]);
const total = ref(0);
const loading = ref(false);

const dialogVisible = computed({
  get() {
    return props.dialogVisible;
  },
  set(value) {
    emit("update:dialogVisible", value);
  },
});

function handleClose() {
  dialogVisible.value = false;
}

function handleConfirm() {
  const rows = table.value.getSelectionRows();

  if (!rows || rows.length === 0) {
    ElMessage.warning("请至少选择一条记录");
    return;
  }
  handleClose();
  emit("select", rows);
}

function loadData() {
  loading.value = true;

  getPackages(query.value)
    .then(({ data }) => {
      tableData.value = data.records;
      total.value = data.total;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

function handleDblclick(row: Package) {
  handleClose();
  emit("select", [row]);
}

onMounted(() => {
  loadData();
});

function handleResetQuery() {
  query.value = new PackageQuery(StateEnum.ENABLED);
  loadData();
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    draggable
    :title="title"
    :before-close="handleClose"
    width="60%"
  >
    <el-header>
      <div class="query">
        <el-input
          v-model.trim="query.keyWord"
          clearable
          placeholder="套餐名称"
          class="query-item"
          style="width: auto"
          @keyup.enter="loadData"
        />
        <el-button
          type="success"
          :icon="Search"
          class="query-item"
          @click="loadData"
        >
          搜索</el-button
        >
        <el-button
          type="warning"
          :icon="RefreshLeft"
          class="query-item"
          @click="handleResetQuery"
          >重置
        </el-button>
      </div>
    </el-header>
    <el-table
      ref="table"
      stripe
      :data="tableData"
      v-loading="loading"
      @row-dblclick="handleDblclick"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="name" label="套餐名称" align="center" />
      <el-table-column prop="remark" label="备注" align="center" />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.query {
  text-align: right;
}
</style>
