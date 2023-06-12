<script setup lang="ts" name="ProcessManagementProcessModler">
/**
 * 流程建模
 * @author ZnPi
 * @date 2023-04-01
 */
import { ref, onMounted } from "vue";

import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import {
  Edit,
  Delete,
  Refresh,
  Search,
  RefreshLeft,
  Download,
  Plus,
  Pointer,
  VideoPlay,
} from "@element-plus/icons-vue";

import {
  getModels,
  deployModel,
  deleteModels,
} from "@/api/process-management/process-model";

import { FormDialog } from "@/model";
import {
  type ProcessModel,
  ProcessModelQuery,
  DesignerDialog,
} from "@/model/process-management/process-model";
import {
  ProcessCategoryDialog,
  type ProcessCategory,
} from "@/model/process-management/process-category";

import Pagination from "@/components/Pagination.vue";
import Form from "./Form.vue";
import DesignerDialogVue from "./DesignerDialog.vue";
import ProcessCategorySelect from "@/views/process/process-management/process-category/components/ProcessCategorySelect.vue";

const showQuery = ref(true);
const query = ref(new ProcessModelQuery());

const table = ref(ElTable);
const tableData = ref<ProcessModel[]>([]);
const total = ref(0);
const loading = ref(false);

const delBtnLoading = ref(false);
const exportLoading = ref(false);
const deployLoading = ref(false);

const formDialog = ref(new FormDialog<ProcessModel>());
const designerDialog = ref(new DesignerDialog());
const processCategoryDialog = ref(new ProcessCategoryDialog());

onMounted(() => {
  loadData();
});

function loadData() {
  loading.value = true;

  getModels(query.value)
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
  query.value = new ProcessModelQuery();
  loadData();
}

function handleAdd() {
  formDialog.value.dialogVisible = true;
  formDialog.value.props.isEdit = false;
}

function handleEdit(row: ProcessModel) {
  formDialog.value.dialogVisible = true;
  formDialog.value.props.isEdit = true;
  formDialog.value.props.formData = row;
}

function handleDel(row: ProcessModel) {
  doDel([row.id!]);
}

function handleDelBatch() {
  const rows: Array<ProcessModel> = table.value.getSelectionRows();
  if (!rows || rows.length <= 0) {
    ElMessage.warning("至少选择一条记录");
    return;
  }
  doDel(rows.map((e: ProcessModel) => e.id!));
}

function doDel(ids: string[]) {
  ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    delBtnLoading.value = true;

    deleteModels(ids)
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

function handleDesign(row: ProcessModel) {
  if (!row.id || !row.name) {
    ElMessage.error("id 或名称不能为空");
    return;
  }
  designerDialog.value.props.modelId = row.id;
  designerDialog.value.props.modelName = row.name;
  designerDialog.value.dialogVisible = true;
}

function handleDeploy(row: ProcessModel) {
  deployLoading.value = true;
  deployModel(row.id!)
    .then(() => {
      ElMessage.success("部署成功");
      deployLoading.value = false;
    })
    .catch(() => {
      deployLoading.value = false;
    });
}

function handleToCategorySelect() {
  processCategoryDialog.value.dialogVisiable = true;
}

function handleCategorySelect(row: ProcessCategory) {
  query.value.category = row.name;
}
</script>

<template>
  <div class="fixed-app-container">
    <el-header>
      <div class="query">
        <template v-if="showQuery">
          <span class="el-text mx-1 query-item">模型标识：</span>
          <el-input
            v-model="query.key"
            clearable
            placeholder="流程标识"
            class="query-item"
            style="width: auto"
            @keyup.enter="loadData"
          />
          <span class="el-text mx-1 query-item">模型名称：</span>
          <el-input
            v-model="query.name"
            clearable
            placeholder="流程名称"
            class="query-item"
            style="width: auto"
            @keyup.enter="loadData"
          />
          <span class="el-text mx-1 query-item">流程分类：</span>
          <el-input
            v-model="query.category"
            placeholder="流程分类"
            class="query-item"
            readonly
            style="width: auto"
          >
            <template #append>
              <el-button :icon="Search" @click="handleToCategorySelect" />
            </template>
          </el-input>
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
            v-has-authority="['workflow_model_save']"
            type="primary"
            :icon="Plus"
            class="tool-item"
            @click="handleAdd"
          >
            新增
          </el-button>
          <el-button
            v-has-authority="['workflow_model_delete']"
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

        <el-table-column prop="key" label="模型标识" align="center" />
        <el-table-column prop="name" label="模型名称" align="center" />
        <el-table-column prop="category" label="流程分类" align="center" />
        <el-table-column
          prop="version"
          label="模型版本"
          align="center"
          #default="{ row }"
        >
          <el-tag>v{{ row.version }}</el-tag>
        </el-table-column>
        <el-table-column
          prop="metaInfo.description"
          label="描述"
          align="center"
        />
        <el-table-column prop="createTime" label="创建时间" align="center" />

        <el-table-column
          fixed="right"
          label="操作"
          width="300px"
          align="center"
          #default="{ row }"
        >
          <el-button
            v-has-authority="['workflow_model_update']"
            type="primary"
            :icon="Edit"
            link
            @click="handleEdit(row)"
            >修改</el-button
          >
          <el-button
            v-has-authority="['workflow_model_save_design']"
            type="primary"
            :icon="Pointer"
            link
            @click="handleDesign(row)"
            >设计</el-button
          >
          <el-button
            v-has-authority="['workflow_model_deploy']"
            type="primary"
            :icon="VideoPlay"
            link
            :loading="deployLoading"
            @click="handleDeploy(row)"
            >部署</el-button
          >
          <el-button
            v-has-authority="['workflow_model_delete']"
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
      v-model:dialogVisible="formDialog.dialogVisible"
      v-bind="formDialog.props"
      @refresh="loadData"
    />

    <DesignerDialogVue
      v-if="designerDialog.dialogVisible"
      v-model:dialogVisible="designerDialog.dialogVisible"
      v-bind="designerDialog.props"
    />
    <ProcessCategorySelect
      v-model:dialog-visible="processCategoryDialog.dialogVisiable"
      @select="handleCategorySelect"
    />
  </div>
</template>
