<script setup lang="ts" name="HistoryDialog">
/**
 * 历史版本
 * @author ZnPi
 * @date 2023-04-01
 */
import { ref, computed, onMounted } from "vue";

import { ElMessage, ElTable, ElMessageBox } from "element-plus";
import { Picture } from "@element-plus/icons-vue";

import {
  ProcessDefinitionQuery,
  ProcessDefinitionDialog,
  ProcessDefinition,
} from "@/model/process/process-management/process-definition";

import {
  getHistoryProcessDefinitions,
  changeState,
} from "@/api/process/process-management/process-definition";

import Pagination from "@/components/Pagination.vue";
import ProcessDiagramDialogVue from "@/components/workflow/ProcessDiagramDialog.vue";

const emits = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    processKey: string;
  }>(),
  {
    dialogVisible: false,
  }
);

const dialogVisible = computed({
  get() {
    return props.dialogVisible;
  },
  set(value) {
    emits("update:dialogVisible", value);
  },
});

const title = "历史版本";
const query = ref(new ProcessDefinitionQuery());
const tableData = ref<ProcessDefinition[]>([]);
const total = ref(0);
const loading = ref(false);

const changeStateLoading = ref(false);

const processDiagramDialog = ref(new ProcessDefinitionDialog());

onMounted(() => {
  loadData();
});

function loadData() {
  loading.value = true;
  query.value.key = props.processKey;
  getHistoryProcessDefinitions(query.value)
    .then(({ data }) => {
      tableData.value = data.records;
      total.value = data.total;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

function handleToCheckProcessDiagram(row: ProcessDefinition) {
  if (row.id) {
    processDiagramDialog.value.dialogVisible = true;
    processDiagramDialog.value.processId = row.id;
  } else {
    ElMessage.error("流程 ID 不能为空");
  }
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
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    draggable
    :title="title"
    :before-close="() => (dialogVisible = false)"
    width="60%"
  >
    <el-table ref="table" :data="tableData" v-loading="loading" stripe border>
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
        width="80"
      >
        <el-tag type="success">v{{ row.version }}</el-tag>
      </el-table-column>
      <el-table-column
        prop="suspended"
        label="状态"
        align="center"
        #default="{ row }"
        width="90"
      >
        <el-switch
          v-model="row.suspended"
          :active-value="false"
          :inactive-value="true"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          @change="handleChageState(row)"
        />
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="180"
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
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      v-model:current-page="query.pageNum"
      v-model:page-size="query.pageSize"
      @pagination="loadData"
    />
    <ProcessDiagramDialogVue
      v-if="
        processDiagramDialog.dialogVisible && processDiagramDialog.processId
      "
      v-model:dialog-visible="processDiagramDialog.dialogVisible"
      :process-id="processDiagramDialog.processId"
    />
  </el-dialog>
</template>
