<script setup name="SystemRole" lang="ts">
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

import { BaseQuery, FormDialog, ComponentProps } from "@/model";
import type { Role } from "@/model/system/role";
import { ADMIN, SUPER_ADMIN } from "@/model/constant/TenantContant";

import { getRoles, deleteRole } from "@/api/system/role";

import RoleForm from "./RoleForm.vue";
import Pagination from "@/components/Pagination.vue";

const emit = defineEmits<{
  (e: "update:componentProps", componentProps: ComponentProps): void;
}>();

defineProps<{
  componentProps: ComponentProps;
}>();

const showQuery = ref(true);
const query = ref(new BaseQuery());

const table = ref(ElTable);
const tableData = ref<Role[]>([]);
const total = ref(0);
const loading = ref(false);

const delBtnLoading = ref<boolean>(false);

const formDialog = ref(new FormDialog<Role>());

const loadData = () => {
  loading.value = true;

  getRoles(query.value)
    .then(({ data }) => {
      tableData.value = data.records;
      total.value = data.total;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
};

function handleResetQuery() {
  query.value = new BaseQuery();
  loadData();
}

const handleAdd = () => {
  formDialog.value.dialogVisible = true;
  formDialog.value.props.isEdit = false;
};

const handleEdit = (row: Role) => {
  formDialog.value.dialogVisible = true;
  formDialog.value.props.isEdit = true;
  formDialog.value.props.formData = row;
};

const handleDel = (row: Role) => {
  if (!row.id) {
    ElMessage.error("id 不能为空");
    return;
  }

  doDel([row.id]);
};

const handleDelBatch = () => {
  const rows: Array<Role> = table.value.getSelectionRows();
  if (!rows || rows.length <= 0) {
    ElMessage.warning("至少选择一条记录");
    return;
  }
  doDel(rows.map((e: Role) => e.id!));
};

function doDel(ids: number[]) {
  ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    delBtnLoading.value = true;

    deleteRole(ids)
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

function selectable(row: Role) {
  if (row.roleCode === SUPER_ADMIN || row.roleCode === ADMIN) {
    return false;
  }
  return true;
}

const handleRoleClick = (row: Role) => {
  emit("update:componentProps", new ComponentProps(row.id, row.name));
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div>
    <el-header>
      <div class="query">
        <template v-if="showQuery">
          <el-input
            v-model="query.keyWord"
            clearable
            placeholder="名称/编码"
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
            v-has-authority="['sys_role_add']"
            type="primary"
            :icon="Plus"
            class="tool-item"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button
            v-has-authority="['sys_role_delete']"
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
            <el-tooltip content="显示/隐藏搜索">
              <el-button :icon="Search" @click="showQuery = !showQuery" />
            </el-tooltip>
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
        row-key="id"
        border
        @row-click="handleRoleClick"
        height="100%"
      >
        <el-table-column type="selection" width="55" :selectable="selectable" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="roleCode" label="角色编码" />
        <el-table-column prop="roleScope" label="权限范围" #default="{ row }">
          <el-tag v-if="row.roleScope === 1" type="info">全部</el-tag>
          <el-tag v-else-if="row.roleScope === 2" type="warning">部门</el-tag>
          <el-tag v-else-if="row.roleScope === 3" type="warning"
            >部门及下级部门</el-tag
          >
          <el-tag v-else-if="row.roleScope === 4" type="warning"
            >自定义部门</el-tag
          >
          <el-tag v-else-if="row.roleScope === 5" type="warning">本人</el-tag>
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" />

        <el-table-column
          fixed="right"
          label="操作"
          width="160px"
          align="center"
          #default="{ row }"
        >
          <el-button
            v-has-authority="['sys_role_edit']"
            type="primary"
            :icon="Edit"
            link
            :disabled="row.roleCode === SUPER_ADMIN || row.roleCode === ADMIN"
            @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button
            v-has-authority="['sys_role_delete']"
            type="danger"
            :icon="Delete"
            link
            :loading="delBtnLoading"
            :disabled="row.roleCode === SUPER_ADMIN || row.roleCode === ADMIN"
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

    <RoleForm
      v-if="formDialog.dialogVisible"
      v-model:dialog-visible="formDialog.dialogVisible"
      v-bind="formDialog.props"
      @refresh="loadData"
    />
  </div>
</template>
