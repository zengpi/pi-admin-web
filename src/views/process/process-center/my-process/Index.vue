<script setup lang="ts" name="ProcessCenterMyProcess">
/**
 * 我的流程
 * @author ZnPi
 * @date 2023-04-07
 */
import { ref, onMounted } from "vue";

import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import {
  Search,
  RefreshLeft,
  Refresh,
  View,
  Remove,
  Delete,
} from "@element-plus/icons-vue";

import {
  cancelProcessInstance,
  deleteProcessInstance,
  getMyProcesses,
} from "@/api/process/process-center/process-instance";

import { ProcessDetailDialog } from "@/model/process/process-center";
import {
  MyProcessQuery,
  type MyProcess,
} from "@/model/process/process-center/process-instance";

import Pagination from "@/components/Pagination.vue";
import ProcessDetail from "@/components/workflow/ProcessDetail.vue";

const showQuery = ref(true);
const query = ref(new MyProcessQuery());

const table = ref(ElTable);
const tableData = ref<MyProcess[]>([]);
const total = ref(0);
const loading = ref(false);
const cancelLoading = ref(false);
const deleteLoading = ref(false);

const detailDialog = ref(new ProcessDetailDialog());

onMounted(() => {
  loadData();
});

function loadData() {
  loading.value = true;
  getMyProcesses(query.value)
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
  query.value = new MyProcessQuery();
  loadData();
}

function handleDetail(row: MyProcess) {
  if (!row.id) {
    ElMessage.error("流程实例 ID 不能为空");
    return;
  }
  detailDialog.value.dialogVisible = true;
  detailDialog.value.processInstanceId = row.id;
}

function handleCancel(row: MyProcess) {
  ElMessageBox.confirm("将取消选中的流程，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    cancelLoading.value = true;
    cancelProcessInstance(row.id!)
      .then(() => {
        ElMessage.success("取消成功");
        cancelLoading.value = false;
        loadData();
      })
      .catch(() => {
        cancelLoading.value = false;
      });
  });
}

function handleDelete(row: MyProcess) {
  ElMessageBox.confirm("将删除选中的流程，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    deleteLoading.value = true;
    deleteProcessInstance(row.id!)
      .then(() => {
        ElMessage.success("删除成功");
        deleteLoading.value = false;
        loadData();
      })
      .catch(() => {
        deleteLoading.value = false;
      });
  });
}
</script>

<template>
  <div class="fixed-app-container">
    <el-header>
      <div class="query">
        <template v-if="showQuery">
          <span class="el-text mx-1 query-item">流程标识：</span>
          <el-input v-model="query.key" clearable placeholder="流程标识" class="query-item" style="width: auto"
            @keyup.enter="loadData" />
          <span class="el-text mx-1 query-item">流程名称：</span>
          <el-input v-model="query.name" clearable placeholder="流程名称" class="query-item" style="width: auto"
            @keyup.enter="loadData" />
          <span class="el-text mx-1 query-item">流程分类：</span>
          <el-input v-model="query.category" clearable placeholder="流程分类" class="query-item" style="width: auto"
            @keyup.enter="loadData" />
          <el-button type="success" :icon="Search" class="query-item" @click="loadData">
            搜索</el-button>
          <el-button type="warning" :icon="RefreshLeft" class="query-item" @click="handleResetQuery">重置
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
        <el-table-column prop="processDefinitionName" label="流程名称" align="center" show-overflow-tooltip />
        <el-table-column prop="processCategory" label="流程分类" align="center" show-overflow-tooltip />
        <el-table-column prop="processDefinitionVersion" label="版本" align="center" #default="{ row }">
          <el-tag>v{{ row.processDefinitionVersion }}</el-tag>
        </el-table-column>
        <el-table-column prop="currentNode" label="当前节点" align="center" show-overflow-tooltip />
        <el-table-column prop="startTime" label="提交时间" align="center" show-overflow-tooltip />
        <el-table-column label="状态" align="center" #default="{ row }">
          <el-tag v-if="!row.endTime" type="warning">进行中</el-tag>
          <el-tag v-else type="success">已完成</el-tag>
        </el-table-column>
        <el-table-column prop="duration" label="耗时" align="center" show-overflow-tooltip />

        <el-table-column fixed="right" label="操作" width="230" align="center" #default="{ row }">
          <el-button type="primary" :icon="View" link @click="handleDetail(row)">详情</el-button>
          <el-button type="warning" :icon="Remove" link @click="handleCancel(row)" :loading="cancelLoading">取消</el-button>
          <el-button type="danger" :icon="Delete" link @click="handleDelete(row)" :loading="deleteLoading">删除</el-button>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <Pagination :total="total" v-model:current-page="query.pageNum" v-model:page-size="query.pageSize"
        @pagination="loadData" />
    </el-footer>
    <ProcessDetail v-if="detailDialog.dialogVisible" v-model:dialog-visible="detailDialog.dialogVisible"
      :process-instance-id="detailDialog.processInstanceId" />
  </div>
</template>
