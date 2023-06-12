<script setup lang="ts">
/**
 * 表单
 * @author ZnPi
 * @date 2023-04-13
 */
import { onMounted, ref, watch } from "vue";

import { ElForm, ElMessage } from "element-plus";
import { Edit, Search, Delete } from "@element-plus/icons-vue";

import { storeToRefs } from "pinia";

import type { Base } from "diagram-js/lib/model";

import modelerStore from "@/stores/workflow/modeler";

import { BaseQuery } from "@/model";
import type { ProcessDefinitionForm } from "@/model/process-management/process-form";

import { getForms, getAllForms } from "@/api/process-management/process-form";

import { getFormValue, setFormValue } from "@/util/workflow/bo-utils/formUtil";
import EventEmitter from "@/util/workflow/EventEmitter";

import CollapseTitle from "@/components/workflow/process-designer/common/CollapseTitle.vue";

const store = modelerStore();

const { getActive, getActiveId } = storeToRefs(store);

const allForms = ref<ProcessDefinitionForm[]>([]);
const formId = ref<string | null>(null);
const formName = ref("");

const dialogVisible = ref(false);
const title = "候选表单";
const query = ref(new BaseQuery());
const table = ref(ElForm);
const tableData = ref<ProcessDefinitionForm[]>([]);
const loading = ref(false);

const total = ref(0);

watch(
  getActiveId,
  () => {
    formId.value = getFormValue(getActive.value as Base) || "";
    if (allForms.value.length === 0) {
      return;
    }
    formName.value =
      allForms.value.find((data) => data.id?.toString() === formId.value)
        ?.name! || "";
  },
  { immediate: true }
);

onMounted(() => {
  getAllForms()
    .then(({ data }) => {
      allForms.value = data;
      formId.value = getFormValue(getActive.value as Base) || "";
      formName.value =
        allForms.value.find((data) => data.id?.toString() === formId.value)
          ?.name! || "";
    })
    .catch(() => {});

  EventEmitter.on("element-update", () => {
    formId.value = getFormValue(getActive.value as Base) || "";
  });
});

function handleFormSelect() {
  dialogVisible.value = true;
  doGetForms();
}

function doGetForms() {
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

function handleFormDelete() {
  if (formId.value == null) {
    return;
  }
  formId.value = null;
  formName.value = "";
  setFormValue(getActive.value as Base, undefined);
}

function handleRowDbClick(row: ProcessDefinitionForm) {
  formId.value = row.id!.toString();
  formName.value = row.name!;

  setFormValue(getActive.value as Base, row.id?.toString());

  dialogVisible.value = false;
}

function handleConfirm() {
  const rows: ProcessDefinitionForm[] = table.value.getSelectionRows();
  if (rows.length === 0 || rows.length > 1) {
    ElMessage.error("请选择一条记录");
    return;
  }
  handleRowDbClick(rows[0]);
}
</script>

<template>
  <div>
    <ElCollapseItem name="element-form">
      <template #title>
        <CollapseTitle :title="$t('panel.form')">
          <el-icon class="header-icon">
            <Edit />
          </el-icon>
        </CollapseTitle>
      </template>
      <el-form label-width="120px" @submit.prevent>
        <el-form-item :label="$t('panel.selectForm')" :label-width="120">
          <el-input v-model="formName" readonly>
            <template #append>
              <el-tooltip effect="dark" content="选择表单" placement="bottom">
                <el-button :icon="Search" @click="handleFormSelect" />
              </el-tooltip>
              <el-tooltip effect="dark" content="删除表单" placement="bottom">
                <el-button
                  :icon="Delete"
                  @click="handleFormDelete"
                  style="margin-left: 5px"
                />
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </ElCollapseItem>

    <el-dialog v-model="dialogVisible" :title="title" draggable width="50%">
      <div style="display: flex">
        <el-input
          v-model="query.keyWord"
          clearable
          placeholder="表单名称..."
          class="query-item"
          style="width: auto; margin: 0 0 10px auto"
          @keyup.enter="doGetForms"
        />
      </div>
      <el-table
        ref="table"
        :data="tableData"
        v-loading="loading"
        stripe
        border
        @row-dblclick="handleRowDbClick"
      >
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
      </el-table>
      <Pagination
        :total="total"
        v-model:current-page="query.pageNum"
        v-model:page-size="query.pageSize"
        @pagination="doGetForms"
      />

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
