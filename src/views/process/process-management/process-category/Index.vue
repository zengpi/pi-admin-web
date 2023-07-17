<script setup lang="ts" name="ProcessCategory">
import { ref, onMounted } from "vue";

import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import {
  Search,
  RefreshLeft,
  Plus,
  Delete,
  Edit,
  Refresh,
} from "@element-plus/icons-vue";

import { FormDialog, BaseQuery } from "@/model";
import type { ProcessCategory } from "@/model/process/process-management/process-category";

import {
  getCategories,
  deleteCategories,
} from "@/api/process/process-management/process-category";

import Form from "./Form.vue";
import Pagination from "@/components/Pagination.vue";

const showQuery = ref(true);
const query = ref(new BaseQuery());

const delBtnLoading = ref(false);

const table = ref(ElTable);
const total = ref(0);
const tableData = ref<ProcessCategory[]>([]);
const loading = ref(false);

const formDialog = ref(new FormDialog<ProcessCategory>());

function loadData() {
  loading.value = true;

  getCategories(query.value)
    .then(({ data }) => {
      tableData.value = data.records!;
      total.value = data.total;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

function handleResetQuery() {
  query.value = new BaseQuery();
  loadData();
}

function handleAdd() {
  formDialog.value.dialogVisible = true;
  formDialog.value.props.isEdit = false;
}

function handleEdit(row: ProcessCategory) {
  formDialog.value.dialogVisible = true;
  formDialog.value.props.isEdit = true;
  formDialog.value.props.formData = row;
}

function handleDel(row: ProcessCategory) {
  doDel([row.id!]);
}

function handleDelBatch() {
  const rows: Array<ProcessCategory> = table.value.getSelectionRows();
  if (!rows || rows.length <= 0) {
    ElMessage.warning("至少选择一条记录");
    return;
  }
  doDel(rows.map((e: ProcessCategory) => e.id!));
}

function doDel(ids: number[]) {
  ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    delBtnLoading.value = true;

    deleteCategories(ids)
      .then(() => {
        ElMessage.success("删除成功");
        loadData();
        delBtnLoading.value = false;
      })
      .catch(() => {
        delBtnLoading.value = false;
      });
  });
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="fixed-app-container">
    <el-header>
      <div class="query">
        <template v-if="showQuery">
          <el-input
            v-model="query.keyWord"
            clearable
            placeholder="分类编码/分类名称"
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
        </template>
      </div>
      <div class="tools">
        <div class="tools-left">
          <el-button
            v-has-authority="['workflow_category_save']"
            type="primary"
            :icon="Plus"
            class="tool-item"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button
            v-has-authority="['workflow_category_delete']"
            type="danger"
            :icon="Delete"
            :loading="delBtnLoading"
            class="tool-item"
            @click="handleDelBatch"
          >
            删除
          </el-button>
        </div>
        <div class="tools-right">
          <el-button-group class="ml-4">
            <el-tooltip content="刷新">
              <el-button :icon="Refresh" @click="loadData" />
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
    </el-header>
    <el-main>
      <el-table
        ref="table"
        border
        :data="tableData"
        v-loading="loading"
        row-key="id"
      >
        <el-table-column type="selection" width="55" />

        <el-table-column prop="code" label="分类编码" />
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="remark" label="备注" />

        <el-table-column
          fixed="right"
          label="操作"
          width="160px"
          align="center"
          #default="{ row }"
        >
          <el-button
            v-has-authority="['workflow_category_update']"
            type="primary"
            :icon="Edit"
            link
            @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button
            v-has-authority="['workflow_category_delete']"
            type="danger"
            :icon="Delete"
            link
            :loading="delBtnLoading"
            @click="handleDel(row)"
            >删除</el-button
          >
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <Pagination
        :total="total"
        v-model:current-page="query.pageNum"
        v-model:page-size="query.pageSize"
        @pagination="loadData"
      />
    </el-footer>
    <Form
      v-if="formDialog.dialogVisible"
      v-model:dialog-visible="formDialog.dialogVisible"
      v-bind="formDialog.props"
      @refresh="loadData"
    />
  </div>
</template>
