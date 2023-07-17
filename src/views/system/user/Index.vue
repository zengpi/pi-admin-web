<script setup name="SystemUser" lang="ts">
/**
 * 用户管理
 * @author ZnPi
 * @since 2022-08-23
 */
import { ref, onMounted, watch } from "vue";

import { ElMessage, ElMessageBox, ElTable, ElTree } from "element-plus";
import type { TreeNodeData } from "element-plus/es/components/tree/src/tree.type";
import {
  RefreshLeft,
  Refresh,
  Search,
  Plus,
  Edit,
  Delete,
  Download,
  Upload,
  Lock,
} from "@element-plus/icons-vue";

import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import { exportFile } from "@/util";

import {
  getUsers,
  updateUser,
  deleteUser,
  exportUser,
  downloadUserImportTemp,
  resetPass,
} from "@/api/system/user";
import { getDeptSelectTree } from "@/api/system/dept";

import { FormDialog, type SelectTree } from "@/model";
import { Query, User, UserForm, UserImportDialog } from "@/model/system/user";

import Form from "./Form.vue";
import UserImport from "./UserImport.vue";
import Pagination from "@/components/Pagination.vue";

const showQuery = ref(true);
const query = ref<Query>(new Query());

const delBtnLoading = ref(false);

const table = ref(ElTable);
const tableData = ref<Array<User>>();
const total = ref(0);
const loading = ref(false);

/**
 * 更改状态 Loading
 */
const switchLoading = ref(false);
/**
 * 导出按钮 Loading
 */
const exportLoading = ref(false);

/**
 * 用户表单弹窗
 */
const userFormDialog = ref(new FormDialog<UserForm>());
/**
 * 用户导入弹窗
 */
const userImportDialog = ref(new UserImportDialog());

/**
 * 状态 条件查询 选项
 */
const statusOptions = ref([
  {
    label: "启用",
    value: 1,
  },
  {
    label: "禁用",
    value: 0,
  },
]);

/**
 * 部门树实例
 */
const treeRef = ref<InstanceType<typeof ElTree>>();
/**
 * 部门（树形）
 */
const deptSelectTree = ref<Array<SelectTree>>();
/**
 * 部门过滤文本
 */
const filterText = ref("");

/**
 * 过滤部门
 */
watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

function loadData() {
  loading.value = true;

  getUsers(query.value)
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
  loadData();
}

function handleAdd() {
  userFormDialog.value.dialogVisible = true;
  userFormDialog.value.props.isEdit = false;
}

function handleEdit(row: User) {
  userFormDialog.value.dialogVisible = true;
  userFormDialog.value.props.isEdit = true;
  userFormDialog.value.props.formData = row;
}

function handleDel(row: User) {
  if (!row.id) {
    ElMessage.error("id 不能为空");
    return;
  }
  doDel(row.id.toString());
}

const handleDelBatch = () => {
  const rows: Array<User> = table.value.getSelectionRows();
  if (!rows || rows.length <= 0) {
    ElMessage.warning("至少选择一条记录");
    return;
  }
  doDel(rows.map((e: User) => e.id).join(","));
};

function doDel(ids: string) {
  ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    delBtnLoading.value = true;

    deleteUser(ids)
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

/**
 * 更改状态
 * @param row 待更改状态记录
 */
function changeStatus(row: User) {
  switchLoading.value = true;

  updateUser(row)
    .then(() => {
      let operation = row.enabled === 0 ? "禁用" : "启用";

      ElMessage.success(`${operation}成功！`);

      switchLoading.value = false;
    })
    .catch(() => {
      switchLoading.value = false;
    });
}

/**
 * 导出
 */
function handleExport() {
  exportLoading.value = true;
  exportUser(query.value)
    .then((response) => {
      exportFile(response);
      exportLoading.value = false;
    })
    .catch(() => {
      exportLoading.value = false;
    });
}

/**
 * 下载导入模板
 */
function handleDownloadTemp() {
  downloadUserImportTemp().then((response) => {
    exportFile(response);
  });
}

/**
 * 用户导入
 */
function handleImport() {
  userImportDialog.value.dialogVisible = true;
}

/**
 * 重置密码
 */
function handleResetPass(row: User) {
  ElMessageBox.confirm("将重置密码为 123456，是否继续？", "警告", {
    type: "warning",
    confirmButtonText: "是",
    cancelButtonText: "否",
  }).then(() => {
    if (!row.id) {
      ElMessage.error("id 不能为空");
      return;
    }
    resetPass(row.id).then(() => {
      ElMessage.success("重置成功！");
    });
  });
}

/**
 * 过滤部门节点
 */
function filterNode(value: string, data: TreeNodeData): boolean {
  if (!value) return true;
  return data.label.includes(value);
}

/**
 * 部门节点点击事件
 */
function handleDeptNodeClick(data: SelectTree) {
  query.value.deptId = data.value;
  loadData();
}

onMounted(() => {
  getDeptSelectTree().then(({ data }) => {
    deptSelectTree.value = data;
  });
  loadData();
});
</script>

<template>
  <div class="app-container">
    <Splitpanes class="default-theme">
      <Pane size="15" min-size="15" max-size="30" style="padding-right: 10px">
        <el-input v-model="filterText" placeholder="请输入关键字搜索" />
        <el-tree
          ref="treeRef"
          :data="deptSelectTree"
          :filter-node-method="filterNode"
          :highlight-current="true"
          :expand-on-click-node="false"
          filter
          class="filter-tree"
          @node-click="handleDeptNodeClick"
        />
      </Pane>
      <Pane>
        <el-header>
          <div class="query">
            <template v-if="showQuery">
              <el-select
                v-model="query.enabled"
                clearable
                placeholder="状态"
                class="query-item"
                style="width: 80px"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-input
                v-model="query.keyWord"
                clearable
                placeholder="用户名/姓名/手机号"
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
                v-has-authority="['sys_user_add']"
                type="primary"
                :icon="Plus"
                class="tool-item"
                @click="handleAdd"
                >新增</el-button
              >
              <el-button
                v-has-authority="['sys_user_delete']"
                type="danger"
                :icon="Delete"
                :loading="delBtnLoading"
                class="tool-item"
                @click="handleDelBatch"
              >
                删除
              </el-button>
              <el-dropdown
                v-has-authority="['sys_user_import']"
                split-button
                type="success"
                class="tool-item"
                @click="handleImport"
              >
                导入
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :icon="Download"
                      @click="handleDownloadTemp"
                      >下载模板</el-dropdown-item
                    >
                    <el-dropdown-item :icon="Upload" @click="handleImport"
                      >导入</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="tools-right">
              <el-button-group class="ml-4">
                <el-tooltip content="显示/隐藏搜索">
                  <el-button :icon="Search" @click="showQuery = !showQuery" />
                </el-tooltip>
                <el-tooltip content="刷新">
                  <el-button :icon="Refresh" @click="loadData" />
                </el-tooltip>
                <el-tooltip content="导出">
                  <el-button
                    v-has-authority="['sys_user_export']"
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
            class="main-table"
            ref="table"
            :data="tableData"
            v-loading="loading"
            stripe
            height="100%"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="username" label="用户名" width="180" />
            <el-table-column prop="name" label="姓名" width="180" />
            <el-table-column prop="phone" label="手机" />
            <el-table-column prop="deptName" label="部门" />
            <el-table-column prop="age" label="年龄" />
            <el-table-column prop="sex" label="性别" #default="{ row }">
              <span v-if="row.sex === 1">男</span>
              <span v-else-if="row.sex === 2">女</span>
            </el-table-column>
            <el-table-column prop="status" label="状态" #default="{ row }">
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
              />
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="170px" />
            <el-table-column
              fixed="right"
              label="操作"
              width="260px"
              align="center"
              #default="{ row }"
            >
              <el-button
                v-has-authority="['sys_user_pass_reset']"
                type="warning"
                :icon="Lock"
                link
                @click="handleResetPass(row)"
                >重置密码</el-button
              >
              <el-button
                v-has-authority="['sys_user_edit']"
                type="primary"
                :icon="Edit"
                link
                @click="handleEdit(row)"
                >编辑</el-button
              >
              <el-button
                v-has-authority="['sys_user_delete']"
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
          v-if="userFormDialog.dialogVisible"
          v-model:dialogVisible="userFormDialog.dialogVisible"
          v-bind="userFormDialog.props"
          @refresh="loadData"
        />
        <UserImport
          v-if="userImportDialog.dialogVisible"
          v-model:dialogVisible="userImportDialog.dialogVisible"
          @refresh="loadData"
        />
      </Pane>
    </Splitpanes>
  </div>
</template>
