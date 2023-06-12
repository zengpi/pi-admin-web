<script setup lang="ts" name="Tenant">
/**
 * 租户管理
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
import type { Tenant } from "@/model/system/tenant";

import { PLATFORM_MANAGER_TENANT_ID } from "@/model/constant/TenantContant";

import { getTenants, saveOrUpdate, deleteTenants } from "@/api/system/tenant";

import Form from "./Form.vue";
import Pagination from "@/components/Pagination.vue";

const showQuery = ref(true);
const query = ref(new BaseQuery());

const delBtnLoading = ref(false);

const table = ref(ElTable);
const total = ref(0);
const tableData = ref<Tenant[]>([]);
const loading = ref(false);

const formDialog = ref(new FormDialog<Tenant>());

/**
 * 更改状态 Loading
 */
const switchLoading = ref(false);

function loadData() {
  loading.value = true;

  getTenants(query.value)
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

function handleEdit(row: Tenant) {
  formDialog.value.dialogVisible = true;
  formDialog.value.props.isEdit = true;
  formDialog.value.props.formData = row;
}

/**
 * 更改状态
 * @param row 待更改状态记录
 */
function changeStatus(row: Tenant) {
  switchLoading.value = true;
  saveOrUpdate(row, true)
    .then(() => {
      let operation = row.enabled === 0 ? "禁用" : "启用";

      ElMessage.success(`${operation}成功！`);

      switchLoading.value = false;
    })
    .catch(() => {
      switchLoading.value = false;
    });
}

function handleDel(row: Tenant) {
  doDel([row.id!]);
}

function handleDelBatch() {
  const rows: Array<Tenant> = table.value.getSelectionRows();
  if (!rows || rows.length <= 0) {
    ElMessage.warning("至少选择一条记录");
    return;
  }
  doDel(rows.map((e: Tenant) => e.id!));
}

function doDel(ids: number[]) {
  ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    delBtnLoading.value = true;

    deleteTenants(ids)
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

function selectable(row: Tenant) {
  if (row.tenantCode === PLATFORM_MANAGER_TENANT_ID) {
    return false;
  }
  return true;
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
            placeholder="租户编号/企业名称/套餐名称"
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
            v-has-authority="['sys_tenant_add']"
            type="primary"
            :icon="Plus"
            class="tool-item"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button
            v-has-authority="['sys_tenant_delete']"
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
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="selectable"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="175px"
        />
        <el-table-column
          prop="tenantCode"
          label="租户编号"
          align="center"
          width="90px"
        />
        <el-table-column
          prop="enterpriseName"
          label="企业名称"
          align="center"
        />
        <el-table-column
          prop="contact"
          label="联系人"
          align="center"
          width="110px"
        />
        <el-table-column prop="phone" label="手机" align="center" />
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          width="170px"
        />
        <el-table-column
          prop="account"
          label="账号"
          align="center"
          width="100px"
        />
        <el-table-column prop="packageName" label="套餐名称" align="center" />
        <el-table-column
          prop="userQuantity"
          label="用户数量"
          align="center"
          #default="{ row }"
          width="100px"
        >
          <el-tag v-if="row.userQuantity === -1">不限制</el-tag>
          <el-tag v-else class="ml-2" type="success">{{
            row.userQuantity
          }}</el-tag>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          align="center"
          #default="{ row }"
          width="90px"
        >
          <el-switch
            v-model="row.enabled"
            :active-value="1"
            :inactive-value="0"
            :loading="switchLoading"
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
            @change="changeStatus(row)"
            :disabled="row.tenantCode === PLATFORM_MANAGER_TENANT_ID"
          />
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" />

        <el-table-column
          fixed="right"
          label="操作"
          width="170px"
          align="center"
          #default="{ row }"
        >
          <el-button
            v-has-authority="['sys_tenant_update']"
            type="primary"
            :icon="Edit"
            link
            @click="handleEdit(row)"
            :disabled="row.tenantCode === PLATFORM_MANAGER_TENANT_ID"
            >编辑</el-button
          >
          <el-divider direction="vertical" border-style="dashed" />
          <el-button
            v-has-authority="['sys_tenant_delete']"
            type="danger"
            :icon="Delete"
            link
            :loading="delBtnLoading"
            @click="handleDel(row)"
            :disabled="row.tenantCode === PLATFORM_MANAGER_TENANT_ID"
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
  width: 200px !important;
}
</style>
