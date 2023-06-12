<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import { ElForm, ElMessage, type FormRules } from "element-plus";

import { Enterprise } from "@/model/system/enterprise";

import { saveOrUpdate } from "@/api/system/enterprise";

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
  (e: "refresh"): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    isEdit?: boolean;
    formData?: Enterprise;
  }>(),
  {
    dialogVisible: false,
    isEdit: false,
  }
);

const title = `${props.isEdit ? "编辑" : "新增"} 企业`;

const form = ref(ElForm);
const formData = ref(new Enterprise());
const rules = ref<FormRules>({
  name: [{ required: true, message: "企业名称不能为空", trigger: "blur" }],
});

const comfirmBtnLoading = ref(false);

const dialogVisible = computed({
  get() {
    return props.dialogVisible;
  },
  set(value) {
    emit("update:dialogVisible", value);
  },
});

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
    width="900px"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-position="top"
      label-width="80px"
    >
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="企业名称" prop="name">
            <el-input v-model="formData.name" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="英文名称" prop="nameEn">
            <el-input v-model="formData.nameEn" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="简称" prop="shortName">
            <el-input v-model="formData.shortName" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="统一社会信用代码" prop="usci">
            <el-input v-model="formData.usci" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注册币种" prop="registeredCurrency">
            <el-input
              v-model="formData.registeredCurrency"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="注册资本" prop="registeredCapital">
            <el-input v-model="formData.registeredCapital" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法人" prop="legalPerson">
            <el-input v-model="formData.legalPerson" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="成立时间" prop="establishingTime">
            <el-date-picker
              v-model="formData.establishingTime"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业性质" prop="businessNature">
            <el-input v-model="formData.businessNature" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="员工数" prop="staffNumber">
            <el-input v-model="formData.staffNumber" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="state">
            <el-input v-model="formData.state" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="所属行业" prop="industryInvolved">
            <el-input
              type="textarea"
              v-model="formData.industryInvolved"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="注册地址" prop="registeredAddress">
            <el-input
              type="textarea"
              v-model="formData.registeredAddress"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="经营范围" prop="businessScope">
            <el-input
              type="textarea"
              v-model="formData.businessScope"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
      </el-row>
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
  </el-dialog>
</template>
