<script setup lang="ts" name="Log">
import { ref, onMounted, computed } from "vue";

import {
  Search,
  RefreshLeft,
  Delete,
  Refresh,
  Download,
  View,
} from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage, ElTable } from "element-plus";

import { toDateString } from "xe-utils";

import { exportFile } from "@/util";

import { getLogs, deleteLogs, exportLog } from "@/api/system/log";

import { Query, Log } from "@/model/system/log";

import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

const showQuery = ref(true);
const query = ref(new Query());

const table = ref(ElTable);
const tableData = ref<Log[]>([]);
const total = ref(0);
const loading = ref(false);

const delBtnLoading = ref(false);
const exportLoading = ref(false);

const detailDialogVisible = ref(false);
const detailForm = ref(new Log());

const queryColumnOptions = [
  {
    label: "操作人",
    value: "create_by",
  },
  {
    label: "标题",
    value: "title",
  },
  {
    label: "方法名称",
    value: "method_name",
  },
];
const typeOptions = [
  {
    label: "正常",
    value: 1,
  },
  {
    label: "异常",
    value: 0,
  },
];

const requestParam = computed(() => {
  let param = detailForm.value.requestParam;
  if (!param || param === "-") {
    return {};
  }
  return JSON.parse(param);
});

onMounted(() => {
  initDate();
  loadData();
});

function loadData() {
  loading.value = true;
  getLogs(query.value)
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
  query.value = new Query();
  initDate();
  loadData();
}

function handleDel(row: Log) {
  if (!row.id) {
    ElMessage.error("id 不能为空");
    return;
  }
  doDel(row.id.toString());
}

const handleDelBatch = () => {
  const rows: Array<Log> = table.value.getSelectionRows();
  if (!rows || rows.length <= 0) {
    ElMessage.warning("至少选择一条记录");
    return;
  }
  doDel(rows.map((e: Log) => e.id).join(","));
};

function doDel(ids: string) {
  ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    delBtnLoading.value = true;

    deleteLogs(ids)
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

function handleExport() {
  exportLoading.value = true;
  exportLog(query.value)
    .then((response) => {
      exportFile(response);
      exportLoading.value = false;
    })
    .catch(() => {
      exportLoading.value = false;
    });
}

function initDate() {
  const now = new Date();
  query.value.createTime = [
    toDateString(now, "yyyy-MM-dd 00:00:00"),
    toDateString(now, "yyyy-MM-dd 23:59:59"),
  ];
}

function handleView(row: Log) {
  detailDialogVisible.value = true;
  detailForm.value = row;
}
</script>

<template>
  <div class="fixed-app-container">
    <el-header>
      <div class="query">
        <template v-if="showQuery">
          <el-date-picker
            v-model="query.createTime"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="query-item"
            style="width: auto"
          />
          <el-select
            v-model="query.type"
            clearable
            placeholder="类型"
            class="query-item"
            style="width: 110px"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="query.queryColumn"
            clearable
            placeholder="查询字段"
            class="query-item"
            style="width: 110px"
          >
            <el-option
              v-for="item in queryColumnOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="query.keyWord"
            clearable
            placeholder="请输入关键字..."
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
            <el-tooltip content="导出">
              <el-button
                :icon="Download"
                :loading="exportLoading"
                @click="handleExport"
              />
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
    </el-header>
    <el-main>
      <el-table
        ref="table"
        :data="tableData"
        v-loading="loading"
        stripe
        border
        height="100%"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          prop="createTime"
          label="时间"
          width="180"
          align="center"
        />
        <el-table-column
          prop="createBy"
          label="操作人"
          width="120"
          align="center"
        />
        <el-table-column prop="type" label="类型" width="85" #default="{ row }">
          <el-tag v-if="row.type === 0" type="danger" effect="dark">
            异常
          </el-tag>
          <el-tag v-else-if="row.type === 1" type="success" effect="dark">
            正常
          </el-tag>
        </el-table-column>
        <el-table-column prop="ip" label="IP地址" width="100" align="center" />
        <el-table-column
          prop="title"
          label="标题"
          width="100"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="requestUrl"
          label="请求URL"
          width="200"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="requestMethod"
          label="请求方式"
          width="90"
          align="center"
        />
        <el-table-column
          prop="requestTime"
          label="请求时间"
          width="110"
          align="center"
          #default="{ row }"
        >
          <el-tag v-if="row.requestTime" effect="dark">
            {{ row.requestTime }} ms
          </el-tag>
        </el-table-column>
        <el-table-column
          prop="methodName"
          label="方法名称"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="requestParam"
          label="请求参数"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="exceptionDesc"
          label="异常描述"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="170px"
          align="center"
          #default="{ row }"
        >
          <el-button type="primary" :icon="View" link @click="handleView(row)"
            >查看</el-button
          >
          <el-divider direction="vertical" border-style="dashed" />
          <el-tooltip content="删除" placement="top">
            <el-button
              v-has-authority="['sys_log_delete']"
              type="danger"
              :icon="Delete"
              link
              :loading="delBtnLoading"
              @click="handleDel(row)"
              >删除</el-button
            >
          </el-tooltip>
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

    <el-dialog
      v-model="detailDialogVisible"
      title="日志详情"
      width="1000px"
      top="5vh"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-descriptions class="margin-top" :column="3" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">标题</div>
          </template>
          {{ detailForm.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">类型</div>
          </template>
          <el-tag v-if="detailForm.type === 1" type="success">正常</el-tag>
          <el-tag v-else-if="detailForm.type === 0" type="danger">异常</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">请求时间</div>
          </template>
          <el-tag type="success">{{ detailForm.requestTime }}ms</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">请求方式</div>
          </template>
          <el-tag v-if="detailForm.requestMethod === 'GET'">GET</el-tag>
          <el-tag v-else-if="detailForm.requestMethod === 'POST'" type="success"
            >POST</el-tag
          >
          <el-tag v-else-if="detailForm.requestMethod === 'PUT'" type="warning"
            >PUT</el-tag
          >
          <el-tag
            v-else-if="detailForm.requestMethod === 'DELETE'"
            type="danger"
            >DELETE</el-tag
          >
          <el-tag v-else-if="detailForm.requestMethod === 'PATCH'" type="info"
            >PATCH</el-tag
          >
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template #label>
            <div class="cell-item">IP地址</div>
          </template>
          {{ detailForm.ip }}
        </el-descriptions-item>
        <el-descriptions-item :span="3">
          <template #label>
            <div class="cell-item">方法名称</div>
          </template>
          {{ detailForm.methodName }}
        </el-descriptions-item>
        <el-descriptions-item :span="3">
          <template #label>
            <div class="cell-item">请求参数</div>
          </template>
          <VueJsonPretty
            :data="requestParam"
            :showIcon="true"
            :virtual="true"
          />
        </el-descriptions-item>
        <el-descriptions-item :span="3">
          <template #label>
            <div class="cell-item">异常描述</div>
          </template>
          {{ detailForm.exceptionDesc }}
        </el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.vjs-tree.is-virtual) {
  width: 100%;
  border: 1px solid var(--el-border-color);
}
</style>
