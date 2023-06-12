<script setup lang="ts" name="ProcessCenterProcessCreate">
/**
 * 流程新建
 * @author ZnPi
 * @date 2023-04-03
 */
import { ref, onMounted } from "vue";

import { ElTable } from "element-plus";
import {
  Search,
  RefreshLeft,
  Refresh,
  VideoPlay,
  Picture,
} from "@element-plus/icons-vue";

import {
  ProcessDefinitionQuery,
  ProcessDefinitionDialog,
  StartProcessDialog,
  type ProcessDefinition,
} from "@/model/process-management/process-definition";

import { getBootableDefinition } from "@/api/process-management/process-definition";

import Pagination from "@/components/Pagination.vue";
import ProcessDiagramDialogVue from "@/components/workflow/ProcessDiagramDialog.vue";
import StartProcessDialogVue from "./StartProcessDialog.vue";

const showQuery = ref(true);
const definitionQuery = ref(new ProcessDefinitionQuery(false));

const definitionTable = ref(ElTable);
const definitionTableData = ref<ProcessDefinition[]>([]);
const definitionTotal = ref(0);
const definitionLoading = ref(false);

const processDiagramDialog = ref(new ProcessDefinitionDialog());
const startProcessDialog = ref(new StartProcessDialog());

onMounted(() => {
  loadDefinitionData();
});

function loadDefinitionData() {
  definitionLoading.value = true;
  // 只查看最新版本
  definitionQuery.value.latestVersion = true;
  getBootableDefinition(definitionQuery.value)
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
  loadDefinitionData();
}

function handleToCheckProcessDiagram(row: ProcessDefinition) {
  processDiagramDialog.value.dialogVisible = true;
  processDiagramDialog.value.processId = row.id!;
}

function handleCreate(row: ProcessDefinition) {
  startProcessDialog.value.dialogVisible = true;
  startProcessDialog.value.processDefinitionId = row.id!;
}
</script>

<template>
  <div class="fixed-app-container">
    <el-header>
      <div class="query">
        <template v-if="showQuery">
          <span class="el-text mx-1 query-item">流程标识：</span>
          <el-input
            v-model="definitionQuery.key"
            clearable
            placeholder="流程标识"
            class="query-item"
            style="width: auto"
            @keyup.enter="loadDefinitionData"
          />
          <span class="el-text mx-1 query-item">流程名称：</span>
          <el-input
            v-model="definitionQuery.name"
            clearable
            placeholder="流程名称"
            class="query-item"
            style="width: auto"
            @keyup.enter="loadDefinitionData"
          />
          <span class="el-text mx-1 query-item">流程分类：</span>
          <el-input
            v-model="definitionQuery.category"
            clearable
            placeholder="流程分类"
            class="query-item"
            style="width: auto"
            @keyup.enter="loadDefinitionData"
          />
          <el-button
            type="success"
            :icon="Search"
            class="query-item"
            @click="loadDefinitionData"
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
        <div class="tools-right">
          <el-button-group class="ml-4">
            <!-- <el-tooltip content="显示/隐藏搜索">
              <el-button :icon="Search" @click="showQuery = !showQuery" />
            </el-tooltip> -->
            <el-tooltip content="刷新">
              <el-button :icon="Refresh" @click="loadDefinitionData" />
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
    </el-header>
    <el-main>
      <el-table
        ref="definitionTable"
        :data="definitionTableData"
        v-loading="definitionLoading"
        stripe
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          prop="key"
          label="流程标识"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="name"
          label="流程名称"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="category"
          label="流程分类"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="version"
          label="版本"
          align="center"
          #default="{ row }"
        >
          <el-tag type="warning">v{{ row.version }}</el-tag>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="200"
          align="center"
          #default="{ row }"
        >
          <el-button
            type="primary"
            :icon="Picture"
            link
            @click="handleToCheckProcessDiagram(row)"
            >流程图</el-button
          >
          <el-button
            type="success"
            :icon="VideoPlay"
            link
            @click="handleCreate(row)"
            >发起</el-button
          >
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <Pagination
        :total="definitionTotal"
        v-model:current-page="definitionQuery.pageNum"
        v-model:page-size="definitionQuery.pageSize"
        @pagination="loadDefinitionData"
      />
    </el-footer>
    <ProcessDiagramDialogVue
      v-if="
        processDiagramDialog.dialogVisible && processDiagramDialog.processId
      "
      v-model:dialog-visible="processDiagramDialog.dialogVisible"
      :process-id="processDiagramDialog.processId"
    />
    <StartProcessDialogVue
      v-if="startProcessDialog.dialogVisible"
      v-model:dialog-visible="startProcessDialog.dialogVisible"
      :process-definition-id="startProcessDialog.processDefinitionId"
    />
  </div>
</template>
