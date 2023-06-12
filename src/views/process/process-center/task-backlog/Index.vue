<script setup lang="ts" name="TaskBackLog">
/**
 * 代办任务
 * @author ZnPi
 * @date 2023-04-15
 */
import { ref, onMounted } from "vue";

import { Pointer, Search, RefreshLeft, Refresh } from "@element-plus/icons-vue";

import { TaskQuery, type TodoTask } from "@/model/process-center/process-task";
import { ProcessDetailDialog } from "@/model/process-center";

import { getTodoTask } from "@/api/process-center/process-task";

import ProcessDetail from "@/components/workflow/ProcessDetail.vue";
import Pagination from "@/components/Pagination.vue";

const showQuery = ref(true);
const query = ref(new TaskQuery());

const tableData = ref<TodoTask[]>([]);
const total = ref(0);
const loading = ref(false);

const detailDialog = ref(new ProcessDetailDialog());

onMounted(() => {
  loadData();
});

function loadData() {
  loading.value = true;
  getTodoTask(query.value)
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
  query.value = new TaskQuery();
  loadData();
}

function handle(row: TodoTask) {
  detailDialog.value.dialogVisible = true;
  detailDialog.value.processInstanceId = row.processInstanceId!;
  detailDialog.value.taskId = row.id;
}
</script>

<template>
  <div class="fixed-app-container">
    <el-header>
      <div class="query">
        <template v-if="showQuery">
          <el-date-picker
            v-model="query.dateRange"
            type="daterange"
            range-separator="到"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            class="query-item"
          />

          <el-input
            v-model="query.processDefinitionName"
            clearable
            placeholder="流程名称"
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
        <div class="tools-right">
          <el-button-group class="ml-4">
            <!-- <el-tooltip content="显示/隐藏搜索">
              <el-button :icon="Search" @click="showQuery = !showQuery" />
            </el-tooltip> -->
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

        <el-table-column
          prop="id"
          label="任务编号"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="processDefinitionName"
          label="流程名称"
          align="center"
        />
        <el-table-column prop="name" label="审批节点" align="center" />
        <el-table-column
          prop="processDefinitionVersion"
          label="版本"
          align="center"
        />
        <el-table-column prop="startName" label="发起人" align="center" />
        <el-table-column prop="createTime" label="接收时间" align="center" />

        <el-table-column
          fixed="right"
          label="操作"
          width="90px"
          align="center"
          #default="{ row }"
        >
          <el-button type="primary" :icon="Pointer" link @click="handle(row)"
            >办理</el-button
          >
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <ProcessDetail
        v-if="detailDialog.dialogVisible"
        v-model:dialog-visible="detailDialog.dialogVisible"
        :process-instance-id="detailDialog.processInstanceId"
        :task-id="detailDialog.taskId"
        :is-approval="true"
        @refresh="loadData"
      />
    </el-footer>
    <Pagination
      :total="total"
      v-model:current-page="query.pageNum"
      v-model:page-size="query.pageSize"
      @pagination="loadData"
    />
  </div>
</template>
