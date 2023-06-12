<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import { ElForm, ElMessage, type FormRules } from "element-plus";

import { getLoading } from "@/util/element-plus";

import {
  saveOrUpdate,
  getDataPermissionDeptIdsByRoleId,
} from "@/api/system/role";
import { getDeptSelectTree } from "@/api/system/dept";

import type { SelectTree } from "@/model";
import { Role } from "@/model/system/role";

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
  (e: "refresh"): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    isEdit?: boolean;
    formData?: Role;
  }>(),
  {
    dialogVisible: false,
    isEdit: false,
  }
);

const title = `${props.isEdit ? "编辑" : "新增"} 角色`;

const form = ref(ElForm);
const formData = ref(new Role());
const rules = ref<FormRules>({
  name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
  roleCode: [{ required: true, message: "角色编码不能为空", trigger: "blur" }],
});

const comfirmBtnLoading = ref(false);

const roleScopeOptions = ref([
  {
    label: "全部",
    value: 1,
  },
  {
    label: "部门",
    value: 2,
  },
  {
    label: "部门及下级部门",
    value: 3,
  },
  {
    label: "自定义部门",
    value: 4,
  },
  {
    label: "本人",
    value: 5,
  },
]);

const deptSelectTree = ref<Array<SelectTree>>([]);

const dialogVisible = computed({
  get() {
    return props.dialogVisible;
  },
  set(value) {
    emit("update:dialogVisible", value);
  },
});

const closeDialog = () => {
  emit("update:dialogVisible", false);
};

const handleConfirm = () => {
  form.value.validate((valid: boolean) => {
    if (valid) {
      comfirmBtnLoading.value = true;

      saveOrUpdate(formData.value, props.isEdit)
        .then(() => {
          ElMessage.success("操作成功");
          closeDialog();
          emit("refresh");
          comfirmBtnLoading.value = false;
        })
        .catch(() => {
          comfirmBtnLoading.value = false;
        });
    }
  });
};

onMounted(() => {
  const loading = getLoading();
  getDeptSelectTree()
    .then(({ data }) => {
      deptSelectTree.value = data;
    })
    .catch((error) => {
      console.error(error);
    });

  if (props.isEdit) {
    formData.value = JSON.parse(JSON.stringify(props.formData));
    if (formData.value.roleScope === 4) {
      getDataPermissionDeptIdsByRoleId(formData.value.id!)
        .then(({ data }) => {
          formData.value.customDept = data;
          loading.close();
        })
        .catch(() => {
          loading.close();
        });
    } else {
      loading.close();
    }
  } else {
    loading.close();
  }
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    draggable
    :title="title"
    :close-on-click-modal="false"
    :before-close="closeDialog"
    width="400px"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="85px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="formData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="formData.roleCode" autocomplete="off" />
      </el-form-item>
      <el-form-item label="权限范围" prop="roleScope">
        <el-select
          v-model="formData.roleScope"
          class="m-2"
          placeholder="Select"
          style="width: 300px"
        >
          <el-option
            v-for="item in roleScopeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="formData.roleScope === 4"
        label="自定义部门"
        prop="customDept"
      >
        <el-tree-select
          v-model="formData.customDept"
          multiple
          show-checkbox
          :data="deptSelectTree"
          :check-strictly="true"
          :render-after-expand="false"
          placeholder="请选择部门"
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item label="角色描述" prop="username">
        <el-input
          type="textarea"
          v-model="formData.roleDesc"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          :loading="comfirmBtnLoading"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
