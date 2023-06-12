<script setup lang="ts">
/**
 * 审批人设置
 * @author ZnPi
 * @date 2023-04-13
 */
import { ref, watch, onMounted } from "vue";

import { ElForm, ElMessage, ElTable } from "element-plus";
import { UserFilled, Search } from "@element-plus/icons-vue";

import type { Base } from "diagram-js/lib/model";

import {
  setAssigneeUserValue,
  getAssigneeUserValue,
  AssigneeForm,
} from "@/util/workflow/bo-utils/assigneeUtil";

import { storeToRefs } from "pinia";
import modelerStore from "@/stores/workflow/modeler";

import { BaseQuery, type SelectTree } from "@/model";
import type { User, Query as UserQuery } from "@/model/system/user";
import type { Role } from "@/model/system/role";

import { getDeptSelectTree } from "@/api/system/dept";
import { getRoles } from "@/api/system/role";
import { getUsers } from "@/api/system/user";

class Dialog {
  title: string = "";
  query: BaseQuery = new BaseQuery();
  tableData: User[] | Role[] = [];
  total = 0;
  loading = false;
}

const store = modelerStore();

const { getActive, getActiveId } = storeToRefs(store);

const assigneeType = ref<string | undefined>(undefined);
const assigneeTypeOptions = [
  {
    value: "1",
    label: "指定用户",
  },
  {
    value: "2",
    label: "角色",
  },
  {
    value: "3",
    label: "部门",
  },
  {
    value: "4",
    label: "发起人",
  },
  {
    value: "5",
    label: "表单指定",
  },
];
const assigneeNames = ref<string | number[]>("");

const approvalType = ref<string>("无");

const dialogVisible = ref(false);
const dialogData = ref(new Dialog());
const table = ref(ElTable);

const deptSelectTree = ref<Array<SelectTree>>([]);

const assigneeForm = ref<AssigneeForm>(new AssigneeForm());
const deptTree = ref();

watch(
  getActiveId,
  () => {
    let assigneeForm =
      getAssigneeUserValue(getActive.value as Base) || new AssigneeForm();

    assigneeType.value = assigneeForm.assigneeType;

    if (assigneeType.value === "3" && assigneeForm.assigneeNames) {
      let names = assigneeForm.assigneeNames!.split(",");
      assigneeNames.value = names.map((name) => parseInt(name));
    } else {
      assigneeNames.value = assigneeForm.assigneeNames as string;
    }
  },
  { immediate: true }
);

onMounted(() => {
  getDeptSelectTree()
    .then(({ data }) => {
      deptSelectTree.value = data;
    })
    .catch(() => {});
});

function handleAssigneeTypeChange() {
  if (!assigneeType.value) {
    return;
  }
  switch (assigneeType.value) {
    case "1":
    case "2":
    case "3":
      initAssigneeForm();
      break;
    case "4":
      // 发起人
      handleInitiator();
      break;
    case "5":
      // 表单指定
      handleForm();
      break;
  }
}

/**
 * 清空
 */
function handleAssigneeTypeClear() {
  let assigneeForm = new AssigneeForm();
  setAssigneeUserValue(getActive.value as Base, assigneeForm);
}

/**
 * 初始化
 */
function initAssigneeForm() {
  assigneeForm.value = new AssigneeForm();
  assigneeForm.value.assigneeType = assigneeType.value!;
  assigneeNames.value = "";
  setAssigneeUserValue(getActive.value as Base, assigneeForm.value);
}

function handleInitiator() {
  initAssigneeForm();
  assigneeForm.value.assignee = "${initiator}";
  setAssigneeUserValue(getActive.value as Base, assigneeForm.value);
}

function handleForm() {
  initAssigneeForm();
  assigneeForm.value.candidateUsers = "${assignee}";
  setAssigneeUserValue(getActive.value as Base, assigneeForm.value);
}

function handleUserSelect() {
  dialogVisible.value = true;
  dialogData.value = new Dialog();
  dialogData.value.title = "候选用户";
  doGetTableData();
}

function handleRoleSelect() {
  dialogVisible.value = true;
  dialogData.value = new Dialog();
  dialogData.value.title = "候选角色";
  doGetTableData();
}

function handleDeptNodeClick() {
  let nodes: SelectTree[] = deptTree.value.getCheckedNodes();
  let ids = nodes.map((node) => "DEPT_" + node.value);
  assigneeForm.value.assigneeNames = nodes.map((node) => node.value).join(",");
  assigneeForm.value.candidateGroups = ids.join(",");
  assigneeForm.value.assigneeType = assigneeType.value;
  setAssigneeUserValue(getActive.value as Base, assigneeForm.value);
}

function doGetTableData() {
  dialogData.value.loading = true;

  if (assigneeType.value === "1") {
    getUsers(dialogData.value.query as UserQuery)
      .then(({ data }) => {
        dialogData.value.tableData = data.records;
        dialogData.value.total = data.total;
        dialogData.value.loading = false;
      })
      .catch(() => {
        dialogData.value.loading = false;
      });
  } else if (assigneeType.value === "2") {
    getRoles(dialogData.value.query)
      .then(({ data }) => {
        dialogData.value.tableData = data.records;
        dialogData.value.total = data.total;
        dialogData.value.loading = false;
      })
      .catch(() => {
        dialogData.value.loading = false;
      });
  }
}

function handleRowDbClick(row: User | Role) {
  assigneeForm.value.assigneeNames = row.name!;
  assigneeNames.value = row.name!;

  if (assigneeType.value === "1") {
    assigneeForm.value.candidateUsers = row.id!.toString();
  } else {
    assigneeForm.value.candidateGroups = "ROLE_" + row.id!.toString();
  }
  setAssigneeUserValue(getActive.value as Base, assigneeForm.value);
  dialogVisible.value = false;
}

function handleConfirm() {
  let rows = table.value.getSelectionRows();
  if (rows.length === 0) {
    ElMessage.error("请至少选择一条记录");
    return;
  }

  assigneeNames.value = rows.map((row) => row.name).join(",");
  if (assigneeType.value === "1") {
    let ids = rows.map((row) => row.id).join(",");
    assigneeForm.value.candidateUsers = ids;
    assigneeForm.value.assigneeNames = assigneeNames.value as string;
  } else {
    let ids = rows.map((row) => "ROLE_" + row.id).join(",");
    assigneeForm.value.candidateGroups = ids;
    assigneeForm.value.assigneeNames = assigneeNames.value as string;
  }
  setAssigneeUserValue(getActive.value as Base, assigneeForm.value);
  dialogVisible.value = false;
}
</script>

<template>
  <div>
    <ElCollapseItem name="element-assignee">
      <template #title>
        <CollapseTitle :title="$t('panel.assigneeSetup')">
          <el-icon class="header-icon">
            <UserFilled />
          </el-icon>
        </CollapseTitle>
      </template>
      <el-form label-width="120px" @submit.prevent>
        <el-form-item :label="$t('panel.type')">
          <el-select
            v-model="assigneeType"
            clearable
            placeholder="请选择"
            @change="handleAssigneeTypeChange"
            @clear="handleAssigneeTypeClear"
          >
            <el-option
              v-for="item in assigneeTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="assigneeType === '1'"
          label="指定用户"
          :label-width="120"
        >
          <el-input v-model="assigneeNames" readonly>
            <template #append>
              <el-tooltip effect="dark" content="选择用户" placement="bottom">
                <el-button :icon="Search" @click="handleUserSelect" />
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>
        <template v-if="assigneeType === '2'">
          <el-form-item label="指定角色" :label-width="120">
            <el-input v-model="assigneeNames" readonly>
              <template #append>
                <el-tooltip effect="dark" content="选择角色" placement="bottom">
                  <el-button :icon="Search" @click="handleRoleSelect" />
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="多实例审批方式" :label-width="120">
            <el-radio-group v-model="approvalType">
              <el-radio-button label="无" />
              <el-radio-button label="会签" />
              <el-radio-button label="或签" />
            </el-radio-group>
          </el-form-item>
        </template>

        <template v-if="assigneeType === '3'">
          <el-form-item label="指定部门" :label-width="120">
            <el-tree-select
              ref="deptTree"
              v-model="assigneeNames"
              :data="deptSelectTree"
              :check-strictly="true"
              :render-after-expand="false"
              show-checkbox
              multiple
              placeholder="请选择部门"
              @check-change="handleDeptNodeClick"
            />
          </el-form-item>
          <el-form-item label="多实例审批方式" :label-width="120">
            <el-radio-group v-model="approvalType">
              <el-radio-button label="无" />
              <el-radio-button label="会签" />
              <el-radio-button label="或签" />
            </el-radio-group>
          </el-form-item>
        </template>
      </el-form>
    </ElCollapseItem>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogData.title"
      draggable
      destroy-on-close
      width="50%"
    >
      <div style="display: flex">
        <el-input
          v-model="dialogData.query.keyWord"
          clearable
          placeholder="关键词..."
          class="query-item"
          style="width: auto; margin: 0 0 10px auto"
          @keyup.enter="doGetTableData"
        />
      </div>
      <el-table
        ref="table"
        :data="dialogData.tableData"
        v-loading="dialogData.loading"
        stripe
        border
        @row-dblclick="handleRowDbClick"
      >
        <el-table-column type="selection" width="55" align="center" />
        <template v-if="assigneeType === '1'">
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="deptName" label="部门" />
        </template>
        <template v-if="assigneeType === '2'">
          <el-table-column prop="name" label="角色名称" />
          <el-table-column prop="roleCode" label="角色编码" />
          <el-table-column prop="roleDesc" label="角色描述" />
        </template>
      </el-table>
      <Pagination
        :total="dialogData.total"
        v-model:current-page="dialogData.query.pageNum"
        v-model:page-size="dialogData.query.pageSize"
        @pagination="doGetTableData"
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
