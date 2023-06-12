<script setup lang="ts" name="TenantEnterprise">
/**
 * 企业管理
 * @author ZnPi
 * @date 2023-05-22
 */
import { ref, onMounted } from "vue";

import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import {
  Search,
  RefreshLeft,
  Plus,
  Delete,
  Edit,
  Refresh,
} from "@element-plus/icons-vue";

import { FormDialog, BaseQuery } from "@/model";
import type { Enterprise } from "@/model/system/enterprise";

import { getEnterprises, deleteEnterprise } from "@/api/system/enterprise";

import Form from "./Form.vue";
import Pagination from "@/components/Pagination.vue";

const showQuery = ref(true);
const query = ref(new BaseQuery());

const delBtnLoading = ref(false);

const table = ref(ElTable);
const total = ref(0);
const tableData = ref<Enterprise[]>([]);
const loading = ref(false);

const formDialog = ref(new FormDialog<Enterprise>());

function loadData() {
  loading.value = true;

  getEnterprises(query.value)
    .then(({ data }) => {
      tableData.value = data.records!;
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

function handleEdit(row: Enterprise) {
  formDialog.value.dialogVisible = true;
  formDialog.value.props.isEdit = true;
  formDialog.value.props.formData = row;
}

function handleDel(row: Enterprise) {
  doDel([row.id!]);
}

function handleDelBatch() {
  const rows: Array<Enterprise> = table.value.getSelectionRows();
  if (!rows || rows.length <= 0) {
    ElMessage.warning("至少选择一条记录");
    return;
  }
  doDel(rows.map((e: Enterprise) => e.id!));
}

function doDel(ids: number[]) {
  ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    delBtnLoading.value = true;

    deleteEnterprise(ids)
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

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="fixed-app-container">
    <el-header>
      <div class="query">
        <template v-if="showQuery">
          <el-input
            v-model="query.keyWord"
            clearable
            placeholder="企业名称/统一社会信用代码"
            class="query-item query-input"
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
            v-has-authority="['sys_enterprise_add']"
            type="primary"
            :icon="Plus"
            class="tool-item"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button
            v-has-authority="['sys_enterprise_delete']"
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
          prop="name"
          label="企业名称"
          width="200"
          align="center"
        />
        <el-table-column
          prop="nameEn"
          label="英文名称"
          width="200"
          align="center"
        />
        <el-table-column
          prop="shortName"
          label="简称"
          width="200"
          align="center"
        />
        <el-table-column
          prop="usci"
          label="统一社会信用代码"
          width="185"
          align="center"
        />
        <el-table-column
          prop="registeredCurrency"
          label="注册币种"
          width="90"
          align="center"
        />
        <el-table-column
          prop="registeredCapital"
          label="注册资本"
          width="120"
          align="center"
        />
        <el-table-column
          prop="legalPerson"
          label="法人"
          width="90"
          align="center"
        />
        <el-table-column
          prop="establishingTime"
          label="成立时间"
          width="120"
          align="center"
        />
        <el-table-column
          prop="businessNature"
          label="企业性质"
          width="160"
          align="center"
        />
        <el-table-column
          prop="industryInvolved"
          label="所属行业"
          width="160"
          align="center"
        />
        <el-table-column
          prop="registeredAddress"
          label="注册地址"
          width="160"
          align="center"
        />
        <el-table-column
          prop="businessScope"
          label="经营范围"
          width="180"
          align="center"
        />
        <el-table-column
          prop="staffNumber"
          label="员工数"
          width="180"
          align="center"
        />
        <el-table-column prop="state" label="状态" width="180" align="center" />

        <el-table-column
          fixed="right"
          label="操作"
          width="160px"
          align="center"
          #default="{ row }"
        >
          <el-button
            v-has-authority="['sys_enterprise_update']"
            type="primary"
            :icon="Edit"
            link
            @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button
            v-has-authority="['sys_enterprise_delete']"
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
      v-model:dialog-visible="formDialog.dialogVisible"
      v-bind="formDialog.props"
      @refresh="loadData"
    />
  </div>
</template>

<style lang="scss" scoped>
.query-input {
  width: 250px !important;
}
</style>
