<script setup lang="ts" name="ProcessManagementProcessDeployment">
/**
 * 流程部署
 * @author ZnPi
 * @date 2023-04-01
 */
import { ref, onMounted } from "vue";

import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import {
  Search,
  RefreshLeft,
  Delete,
  Guide,
  Refresh,
  Picture,
} from "@element-plus/icons-vue";

import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import {
  getProcessDeployments,
  deleteProcessDeployments,
} from "@/api/process/process-management/process-deployment";
import { changeState } from "@/api/process/process-management/process-definition";

import { BaseQuery } from "@/model";
import type { ProcessDeployment } from "@/model/process/process-management/process-deployment";
import {
  ProcessDefinitionQuery,
  ProcessDefinitionDialog,
  type ProcessDefinition,
} from "@/model/process/process-management/process-definition";

import Pagination from "@/components/Pagination.vue";
import ProcessDiagramDialogVue from "@/components/workflow/ProcessDiagramDialog.vue";
import HistoryDialogVue from "./HistoryDialog.vue";
import { getProcessDefinition } from "@/api/process/process-management/process-definition";

const query = ref(new BaseQuery());

const delBtnLoading = ref(false);

const table = ref(ElTable);
const tableData = ref<ProcessDeployment[]>([]);
const total = ref(0);
const loading = ref(false);

const deploymentId = ref("");

/*
流程定义
*/
const showQuery = ref(true);
const definitionQuery = ref(new ProcessDefinitionQuery(false));

const definitionTable = ref(ElTable);
const definitionTableData = ref<ProcessDefinition[]>([]);
const definitionTotal = ref(0);
const definitionLoading = ref(false);

const changeStateLoading = ref(false);

const processDiagramDialog = ref(new ProcessDefinitionDialog());
const historyDialog = ref(new ProcessDefinitionDialog());

const statusOptions = [
  {
    label: "激活",
    value: false,
  },
  {
    label: "挂起",
    value: true,
  },
];

onMounted(() => {
  loadData();
  loadDefinitionData();
});

function loadData() {
  loading.value = true;

  getProcessDeployments(query.value)
    .then(({ data }) => {
      tableData.value = data.records;
      total.value = data.total;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

function handleDel(row: ProcessDefinition) {
  doDel([row.id!]);
}

function handleDelBatch() {
  const rows: Array<ProcessDeployment> = table.value.getSelectionRows();
  if (!rows || rows.length <= 0) {
    ElMessage.warning("至少选择一条记录");
    return;
  }
  doDel(rows.map((e: ProcessDeployment) => e.id!));
}

function doDel(ids: string[]) {
  ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  })
    .then(() => {
      delBtnLoading.value = true;

      deleteProcessDeployments(ids)
        .then(() => {
          ElMessage.success("删除成功");
          loadData();
          delBtnLoading.value = false;
        })
        .catch(() => {
          delBtnLoading.value = false;
        });
    })
    .catch(() => { });
}

function handleTableRowClick(row: ProcessDeployment, column: any) {
  if (column.label === "操作") {
    return;
  }
  if (!row.id) {
    ElMessage.error("流程部署 ID 不能为空");
    return;
  }
  definitionQuery.value = new ProcessDefinitionQuery(false);
  deploymentId.value = row.id;
  definitionQuery.value.deploymentId = row.id;
  loadDefinitionData();
}

function loadDefinitionData() {
  definitionLoading.value = true;
  // 只查看最新版本
  definitionQuery.value.latestVersion = true;
  getProcessDefinition(definitionQuery.value)
    .then(({ data }) => {
      definitionTableData.value = data.records;
      definitionTotal.value = data.total;
      definitionLoading.value = false;
    })
    .catch(() => {
      definitionLoading.value = false;
    });
}

function handleResetQuery() {
  definitionQuery.value = new ProcessDefinitionQuery(false);
  definitionQuery.value.deploymentId = deploymentId.value;
  loadDefinitionData();
}

function handleChageState(row: ProcessDefinition) {
  let action = row.suspended ? "挂起" : "激活";
  ElMessageBox.confirm(`将${action}该流程，是否继续？`, "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  })
    .then(() => {
      if (!row.id) {
        ElMessage.error("流程 ID 不能为空");
        return;
      }
      changeStateLoading.value = true;
      changeState(row.id, row.suspended as boolean)
        .then(() => {
          ElMessage.success(`${action}成功`);
        })
        .catch(() => {
          row.suspended = !row.suspended;
          changeStateLoading.value = false;
        });
      changeStateLoading.value = false;
    })
    .catch(() => {
      row.suspended = !row.suspended;
    });
}

function handleToCheckProcessDiagram(row: ProcessDefinition) {
  processDiagramDialog.value.dialogVisible = true;
  processDiagramDialog.value.processId = row.id;
}

function handleToCheckHistory(row: ProcessDefinition) {
  historyDialog.value.dialogVisible = true;
  historyDialog.value.processKey = row.key;
}
</script>

<template>
  <Splitpanes class="default-theme">
    <Pane size="30" min-size="20" max-size="50" style="padding-right: 10px">
      <div class="fixed-app-container">
        <el-header>
          <div class="tools">
            <div class="tools-left">
              <el-button type="danger" :icon="Delete" :loading="delBtnLoading" class="tool-item" @click="handleDelBatch">
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
        <el-main class="deployment-main">
          <el-table ref="table" :data="tableData" v-loading="loading" stripe border @row-click="handleTableRowClick">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="deploymentTime" label="部署时间" align="center" width="180" />
            <el-table-column prop="name" label="名称" align="center" show-overflow-tooltip />

            <el-table-column fixed="right" label="操作" width="90px" align="center" #default="{ row }">
              <el-button v-has-authority="['workflow_deployment_delete']" type="danger" :icon="Delete" link
                :loading="delBtnLoading" @click="handleDel(row)">删除</el-button>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <Pagination :total="total" v-model:current-page="query.pageNum" v-model:page-size="query.pageSize"
            @pagination="loadData" />
        </el-footer>
      </div>
    </Pane>
    <Pane>
      <div class="fixed-app-container">
        <el-header>
          <div class="query">
            <template v-if="showQuery">
              <span class="el-text mx-1 query-item">流程标识：</span>
              <el-input v-model="definitionQuery.key" clearable placeholder="流程标识" class="query-item" style="width: auto"
                @keyup.enter="loadDefinitionData" />
              <span class="el-text mx-1 query-item">流程名称：</span>
              <el-input v-model="definitionQuery.name" clearable placeholder="流程名称" class="query-item" style="width: auto"
                @keyup.enter="loadDefinitionData" />
              <span class="el-text mx-1 query-item">流程分类：</span>
              <el-input v-model="definitionQuery.category" clearable placeholder="流程分类" class="query-item"
                style="width: auto" @keyup.enter="loadDefinitionData" />
              <span class="el-text mx-1 query-item">状态：</span>
              <el-select v-model="definitionQuery.suspended" clearable placeholder="选择状态" class="query-item">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-button type="success" :icon="Search" class="query-item" @click="loadDefinitionData">
                搜索</el-button>
              <el-button type="warning" :icon="RefreshLeft" class="query-item" @click="handleResetQuery">重置
              </el-button>
            </template>
          </div>
          <div class="tools">
            <div class="tools-right">
              <el-button-group class="ml-4">
                <el-tooltip content="显示/隐藏搜索">
                  <el-button :icon="Search" @click="showQuery = !showQuery" />
                </el-tooltip>
                <el-tooltip content="刷新">
                  <el-button :icon="Refresh" @click="loadDefinitionData" />
                </el-tooltip>
              </el-button-group>
            </div>
          </div>
        </el-header>
        <el-table ref="definitionTable" :data="definitionTableData" v-loading="definitionLoading" stripe border>
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="key" label="流程标识" align="center" show-overflow-tooltip />
          <el-table-column prop="name" label="流程名称" align="center" show-overflow-tooltip />
          <el-table-column prop="category" label="流程分类" align="center" show-overflow-tooltip />
          <el-table-column prop="version" label="版本" align="center" #default="{ row }">
            <el-tag type="success">v{{ row.version }}</el-tag>
          </el-table-column>
          <el-table-column prop="suspended" label="状态" align="center" #default="{ row }">
            <el-switch v-model="row.suspended" :active-value="false" :inactive-value="true" :loading="changeStateLoading"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              " @change="handleChageState(row)" />
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="200" align="center" #default="{ row }">
            <el-button type="primary" :icon="Picture" link @click="handleToCheckProcessDiagram(row)">流程图</el-button>
            <el-button type="warning" :icon="Guide" link @click="handleToCheckHistory(row)">历史版本</el-button>
          </el-table-column>
        </el-table>
        <Pagination :total="definitionTotal" v-model:current-page="definitionQuery.pageNum"
          v-model:page-size="definitionQuery.pageSize" @pagination="loadDefinitionData" />
        <ProcessDiagramDialogVue v-if="processDiagramDialog.dialogVisible && processDiagramDialog.processId
          " v-model:dialog-visible="processDiagramDialog.dialogVisible" :process-id="processDiagramDialog.processId" />
        <HistoryDialogVue v-if="historyDialog.dialogVisible && historyDialog.processKey"
          v-model:dialog-visible="historyDialog.dialogVisible" :process-key="historyDialog.processKey" />
      </div>
    </Pane>
  </Splitpanes>
</template>

<style lang="scss" scoped>
.deployment-main {
  height: calc(100vh - 215px);
}
</style>
