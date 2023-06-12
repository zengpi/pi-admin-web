<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";

import { ElMessage, ElTable, ElTree } from "element-plus";
import { RefreshLeft, Search } from "@element-plus/icons-vue";

import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import { getOptionalUsers } from "@/api/system/user";

import type { SelectTree } from "@/model";
import { OptionalUserQuery, type OptionalUser } from "@/model/system/user";
import type { TreeNodeData } from "element-plus/es/components/tree/src/tree.type";
import { getDeptSelectTree } from "@/api/system/dept";

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
  (e: "select", optionalUsers: Array<OptionalUser>): void;
}>();

const props = defineProps<{
  dialogVisible: boolean;
}>();

const title = `候选用户`;

const query = ref<OptionalUserQuery>(new OptionalUserQuery());

const table = ref(ElTable);
const tableData = ref<Array<OptionalUser>>([]);
const total = ref(0);
const loading = ref(false);

/**
 * 部门树实例
 */
const treeRef = ref<InstanceType<typeof ElTree>>();
/**
 * 部门（树形）
 */
const deptSelectTree = ref<Array<SelectTree>>();
/**
 * 部门过滤文本
 */
const filterText = ref("");

const dialogVisible = computed({
  get() {
    return props.dialogVisible;
  },
  set(value) {
    emit("update:dialogVisible", value);
  },
});

/**
 * 过滤部门
 */
watch(filterText, (val) => {
  treeRef.value!.filter(val);
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

  getOptionalUsers(query.value)
    .then(({ data }) => {
      tableData.value = data.records;
      total.value = data.total;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

function handleDblclick(row: OptionalUser) {
  handleClose();
  emit("select", [row]);
}

onMounted(() => {
  getDeptSelectTree().then(({ data }) => {
    deptSelectTree.value = data;
  });
  loadData();
});

/**
 * 过滤部门节点
 */
function filterNode(value: string, data: TreeNodeData): boolean {
  if (!value) return true;
  return data.label.includes(value);
}

/**
 * 部门节点点击事件
 */
function handleDeptNodeClick(data: SelectTree) {
  query.value.deptId = data.value;
  loadData();
}

function handleResetQuery() {
  query.value = new OptionalUserQuery();
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
    <splitpanes class="default-theme">
      <pane size="20" min-size="15" max-size="30" style="padding-right: 10px">
        <el-input v-model="filterText" placeholder="请输入关键字搜索" />
        <el-tree
          ref="treeRef"
          :data="deptSelectTree"
          :filter-node-method="filterNode"
          :highlight-current="true"
          :expand-on-click-node="false"
          filter
          class="filter-tree"
          @node-click="handleDeptNodeClick"
        />
      </pane>
      <pane>
        <el-header>
          <div class="query">
            <el-input
              v-model.trim="query.keyWord"
              clearable
              placeholder="用户名/姓名/部门"
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
          <el-table-column type="selection" width="55" />
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="deptName" label="部门名称" />
        </el-table>
      </pane>
    </splitpanes>
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
