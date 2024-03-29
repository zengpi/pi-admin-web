<script setup lang="ts" name="MyCopy">
/**
 * 抄送我的
 * @author ZnPi
 * @date 2023-04-23
 */
import { ref, onMounted } from "vue";

import { View, Search, RefreshLeft, Refresh } from "@element-plus/icons-vue";

import { TaskQuery, type Copy } from "@/model/process/process-center/process-task";
import { ProcessDetailDialog } from "@/model/process/process-center";

import { getCopies } from "@/api/process/process-center/process-task";

import ProcessDetail from "@/components/workflow/ProcessDetail.vue";
import Pagination from "@/components/Pagination.vue";
import { ElMessage, ElMessageBox } from "element-plus";

const showQuery = ref(true);
const query = ref(new TaskQuery());

const tableData = ref<Copy[]>([]);
const total = ref(0);
const loading = ref(false);

const detailDialog = ref(new ProcessDetailDialog());

const revokeLoading = ref(false);

onMounted(() => {
  loadData();
});

function loadData() {
  loading.value = true;
  getCopies(query.value)
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

function handleShowLog(row: Copy) {
  detailDialog.value.dialogVisible = true;
  detailDialog.value.processInstanceId = row.processInstanceId!;
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
        <el-table-column prop="createName" label="发起人" align="center" />
        <el-table-column prop="createTime" label="接收时间" align="center" />
        <el-table-column prop="endTime" label="审批时间" align="center" />
        <el-table-column prop="duration" label="耗时" align="center" />

        <el-table-column
          fixed="right"
          label="操作"
          width="160px"
          align="center"
          #default="{ row }"
        >
          <el-button
            type="primary"
            :icon="View"
            link
            @click="handleShowLog(row)"
            >详情</el-button
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
    <ProcessDetail
      v-if="detailDialog.dialogVisible"
      v-model:dialog-visible="detailDialog.dialogVisible"
      :process-instance-id="detailDialog.processInstanceId"
      @refresh="loadData"
    />
  </div>
</template>
