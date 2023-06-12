<script setup lang="ts">
/**
 * 租户管理表单
 * @author ZnPi
 * @date 2023-05-22
 */
import { ref, onMounted, computed } from "vue";

import { ElForm, ElMessage, type FormRules } from "element-plus";
import { Search } from "@element-plus/icons-vue";

import { BaseDialog } from "@/model";
import type { Enterprise } from "@/model/system/enterprise";
import { Tenant } from "@/model/system/tenant";

import { saveOrUpdate } from "@/api/system/tenant";

import { validatePhone, validateEmail } from "@/util/validate";

import OptionalEnterprise from "@/views/system/tenant/enterprise/OptionalEnterprise.vue";
import OptionalPackage from "@/views/system/tenant/package/OptionalPackage.vue";

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
  (e: "refresh"): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    isEdit?: boolean;
    formData?: Tenant;
  }>(),
  {
    dialogVisible: false,
    isEdit: false,
  }
);

const title = `${props.isEdit ? "编辑" : "新增"} 套餐`;

const form = ref(ElForm);
const formData = ref(new Tenant());
const rules = ref<FormRules>({
  enterpriseName: [
    { required: true, message: "企业名称不能为空", trigger: "blur" },
  ],
  contact: [{ required: true, message: "联系人不能为空", trigger: "blur" }],
  account: [{ required: true, message: "账号不能为空", trigger: "blur" }],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
  phone: [{ validator: validatePhone, trigger: "blur" }],
  email: [{ validator: validateEmail, trigger: "blur" }],
});

const comfirmBtnLoading = ref(false);

const enterpriseDialog = ref(new BaseDialog());
const packageDialog = ref(new BaseDialog());

const dialogVisible = computed({
  get() {
    return props.dialogVisible;
  },
  set(value) {
    emit("update:dialogVisible", value);
  },
});

function handleToSelectEnterprise() {
  enterpriseDialog.value.dialogVisible = true;
}

function handleDoSelectEnterprise(rows: Enterprise[]) {
  if (rows.length > 1) {
    ElMessage.warning("选择了多条记录，只会取第一条");
  }
  // 判断所选企业是否已经是租户
  formData.value.enterpriseId = rows[0].id;
  formData.value.enterpriseName = rows[0].name;
}

function handleToSelectPackage() {
  packageDialog.value.dialogVisible = true;
}

function handleDoSelectPackage(rows: Enterprise[]) {
  if (rows.length > 1) {
    ElMessage.warning("选择了多条记录，只会取第一条");
  }
  formData.value.packageId = rows[0].id;
  formData.value.packageName = rows[0].name;
}

function closeDialog() {
  dialogVisible.value = false;
}

function handleComfirm() {
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
}

onMounted(() => {
  if (props.isEdit) {
    formData.value = JSON.parse(JSON.stringify(props.formData));
  }
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    draggable
    :title="title"
    :before-close="closeDialog"
    width="784px"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      :inline="true"
      label-width="90px"
    >
      <el-form-item label="企业名称" prop="enterpriseName">
        <el-input
          v-model="formData.enterpriseName"
          class="input-with-select"
          readonly
          style="width: 250px"
        >
          <template #append>
            <el-button
              :icon="Search"
              @click="handleToSelectEnterprise"
              :disabled="isEdit"
            />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input
          v-model="formData.contact"
          autocomplete="off"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item v-if="!isEdit" label="账号" prop="account">
        <el-input
          v-model="formData.account"
          autocomplete="off"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item v-if="!isEdit" label="密码" prop="password">
        <el-input
          type="password"
          v-model="formData.password"
          autocomplete="off"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input
          v-model="formData.phone"
          autocomplete="off"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="formData.email"
          autocomplete="off"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item label="租户套餐" prop="packageName">
        <el-input
          v-model="formData.packageName"
          class="input-with-select"
          readonly
          style="width: 250px"
        >
          <template #append>
            <el-button :icon="Search" @click="handleToSelectPackage" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="用户数量" prop="userQuantity">
        <el-input-number
          v-model="formData.userQuantity"
          :min="-1"
          controls-position="right"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-radio-group v-model="formData.enabled" style="width: 250px">
          <el-radio-button :label="1">启用</el-radio-button>
          <el-radio-button :label="0">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          v-model="formData.remark"
          autocomplete="off"
          style="width: 250px"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
          type="primary"
          @click="handleComfirm"
          :loading="comfirmBtnLoading"
          >确认</el-button
        >
      </span>
    </template>

    <OptionalEnterprise
      v-if="enterpriseDialog.dialogVisible"
      v-model:dialog-visible="enterpriseDialog.dialogVisible"
      @select="handleDoSelectEnterprise"
    />
    <OptionalPackage
      v-if="packageDialog.dialogVisible"
      v-model:dialog-visible="packageDialog.dialogVisible"
      @select="handleDoSelectPackage"
    />
  </el-dialog>
</template>
