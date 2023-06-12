<script setup lang="ts" name="ProcessManagementForm">
/**
 * 表单配置
 * @author ZnPi
 * @date 2023-04-03
 */
import { ref, onMounted } from "vue";

import {
  Search,
  RefreshLeft,
  Delete,
  Refresh,
  Plus,
  Edit,
} from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage, ElTable } from "element-plus";

import { getForms, deleteForms } from "@/api/process-management/process-form";

import { FormDialog, BaseQuery } from "@/model";
import type { ProcessDefinitionForm } from "@/model/process-management/process-form";

import Pagination from "@/components/Pagination.vue";
import FormVue from "./Form.vue";

const showQuery = ref(true);
const query = ref(new BaseQuery());

const table = ref(ElTable);
const tableData = ref<ProcessDefinitionForm[]>([]);
const total = ref(0);
const loading = ref(false);

const delBtnLoading = ref(false);

const formDialog = ref(new FormDialog<ProcessDefinitionForm>());

onMounted(() => {
  loadData();
});

function loadData() {
  loading.value = true;
  getForms(query.value)
    .then(({ data }) => {
      tableData.value = data.records;
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

function handleEdit(row: ProcessDefinitionForm) {
  formDialog.value.dialogVisible = true;
  formDialog.value.props.isEdit = true;
  formDialog.value.props.formData = row;
}

function handleDel(row: ProcessDefinitionForm) {
  if (!row.id) {
    ElMessage.error("id 不能为空");
    return;
  }
  doDel([row.id]);
}

const handleDelBatch = () => {
  const rows: Array<ProcessDefinitionForm> = table.value.getSelectionRows();
  if (!rows || rows.length <= 0) {
    ElMessage.warning("至少选择一条记录");
    return;
  }
  doDel(rows.map((e: ProcessDefinitionForm) => e.id) as number[]);
};

function doDel(ids: number[]) {
  ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    delBtnLoading.value = true;

    deleteForms(ids)
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
</script>

<template>
  <div class="fixed-app-container">
    <el-header>
      <div class="query">
        <template v-if="showQuery">
          <el-input
            v-model="query.keyWord"
            clearable
            placeholder="表单名称..."
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
            v-has-authority="['workflow_form_save']"
            type="primary"
            :icon="Plus"
            class="tool-item"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button
            v-has-authority="['workflow_form_delete']"
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
      <el-table ref="table" :data="tableData" v-loading="loading" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="name" label="表单名称" align="center" />
        <el-table-column
          prop="builtIn"
          label="是否内置"
          align="center"
          #default="{ row }"
        >
          <el-tag v-if="row.builtIn === 1" type="success">是</el-tag>
          <el-tag v-else-if="row.builtIn === 0" type="warning">否</el-tag>
        </el-table-column>
        <el-table-column prop="componentPath" label="组件路径" align="center" />
        <el-table-column prop="remark" label="备注" align="center" />

        <el-table-column
          fixed="right"
          label="操作"
          width="160px"
          align="center"
          #default="{ row }"
        >
          <el-button
            v-has-authority="['workflow_form_update']"
            type="primary"
            :icon="Edit"
            link
            @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button
            v-has-authority="['workflow_form_delete']"
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
    <FormVue
      v-if="formDialog.dialogVisible"
      v-model:dialog-visible="formDialog.dialogVisible"
      v-bind="formDialog.props"
      @refresh="loadData"
    />
  </div>
</template>
