<script setup name="SystemMenu" lang="ts">
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

import { getMenuTree, deleteMenu } from "@/api/system/menu";

import { FormDialog } from "@/model";
import { MenuTree, Query } from "@/model/system/menu";
import { MenuTypeEnum } from "@/model/enums";

import { PLATFORM_MANAGER_TENANT_ID } from "@/model/constant/TenantContant";

import useStore from "@/stores";

import Form from "./Form.vue";

const showQuery = ref(true);
const query = ref(new Query());

const delBtnLoading = ref(false);

const table = ref(ElTable);
const tableData = ref<MenuTree[]>([]);
const loading = ref(false);

const formDialog = ref(new FormDialog<MenuTree>());

const { useUserStore } = useStore();

function loadData() {
  loading.value = true;

  getMenuTree(query.value)
    .then(({ data }) => {
      tableData.value = data;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

function handleResetQuery() {
  query.value = new Query();
  loadData();
}

function handleAdd() {
  formDialog.value.dialogVisible = true;
  formDialog.value.props.isEdit = false;
}

function handleEdit(row: MenuTree) {
  formDialog.value.props.isEdit = true;
  formDialog.value.dialogVisible = true;
  formDialog.value.props.formData = row;
}

function handleDel(row: MenuTree) {
  if (!row.id) {
    ElMessage.error("id 不能为空");
    return;
  }
  doDel([row.id]);
}

const handleDelBatch = () => {
  const rows: Array<MenuTree> = table.value.getSelectionRows();
  if (!rows || rows.length <= 0) {
    ElMessage.warning("至少选择一条记录");
    return;
  }
  doDel(rows.map((e: MenuTree) => e.id!));
};

function doDel(ids: number[]) {
  ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    delBtnLoading.value = true;

    deleteMenu(ids)
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
  <div class="app-container">
    <el-header>
      <div class="query">
        <template v-if="showQuery">
          <el-input
            v-model="query.keyWord"
            clearable
            placeholder="名称/组件路径/权限标识"
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
        <div
          class="tools-left"
          v-if="useUserStore.tenantId === PLATFORM_MANAGER_TENANT_ID"
        >
          <el-button
            v-has-authority="['sys_menu_add']"
            type="primary"
            :icon="Plus"
            class="tool-item"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button
            v-has-authority="['sys_menu_delete']"
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
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          v-if="useUserStore.tenantId === PLATFORM_MANAGER_TENANT_ID"
          type="selection"
          width="55"
        />
        <el-table-column prop="name" label="菜单名称" width="180" />
        <el-table-column prop="icon" label="图标" width="70" #default="{ row }">
          <SvgIcon v-if="row.icon" :name="row.icon" />
        </el-table-column>
        <el-table-column
          prop="path"
          label="路由路径"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="componentName"
          label="组件名称"
          width="140"
          show-overflow-tooltip
        />
        <el-table-column
          prop="component"
          label="组件路径"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column
          prop="permission"
          label="权限标识"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column prop="sort" label="排序" width="60" />
        <el-table-column
          prop="keepAlive"
          label="是否缓存"
          width="90"
          #default="{ row }"
        >
          <template v-if="row.type === 2">
            <el-tag
              v-if="row.keepAlive === 0"
              type="warning"
              class="mx-1"
              effect="dark"
              >不缓存
            </el-tag>
            <el-tag v-else-if="row.keepAlive === 1" class="mx-1" effect="dark"
              >缓存</el-tag
            >
          </template>
          <span v-else />
        </el-table-column>
        <el-table-column
          prop="type"
          label="菜单类型"
          width="90"
          #default="{ row }"
        >
          <el-tag v-if="row.type === MenuTypeEnum.DIR">目录</el-tag>
          <el-tag type="success" v-if="row.type === MenuTypeEnum.MENU"
            >菜单</el-tag
          >
          <el-tag type="warning" v-if="row.type === MenuTypeEnum.BUTTON"
            >按钮</el-tag
          >
        </el-table-column>
        <el-table-column
          prop="externalLinks"
          label="是否外链"
          width="90"
          #default="{ row }"
        >
          <template v-if="row.type === 2">
            <el-tag
              v-if="row.externalLinks === 0"
              type="warning"
              class="mx-1"
              effect="dark"
              >否
            </el-tag>
            <el-tag
              v-else-if="row.externalLinks === 1"
              class="mx-1"
              effect="dark"
              >是</el-tag
            >
          </template>
          <span v-else />
        </el-table-column>
        <el-table-column
          prop="visible"
          label="是否可见"
          width="90"
          #default="{ row }"
        >
          <el-tag
            v-if="row.visible === 0"
            type="warning"
            class="mx-1"
            effect="dark"
            >不可见
          </el-tag>
          <el-tag v-else-if="row.visible === 1" class="mx-1" effect="dark"
            >可见</el-tag
          >
        </el-table-column>
        <el-table-column prop="redirect" label="重定向路径" width="140" />
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column
          v-if="useUserStore.tenantId === PLATFORM_MANAGER_TENANT_ID"
          fixed="right"
          label="操作"
          width="160px"
          align="center"
          #default="{ row }"
        >
          <el-button
            v-has-authority="['sys_menu_update']"
            type="primary"
            :icon="Edit"
            link
            @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button
            v-has-authority="['sys_menu_delete']"
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
    <Form
      v-if="formDialog.dialogVisible"
      v-model:dialogVisible="formDialog.dialogVisible"
      v-bind="formDialog.props"
      @refresh="loadData"
    />
  </div>
</template>
