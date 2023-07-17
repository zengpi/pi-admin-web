<script setup lang="ts" name="Form">
import { ref, onMounted, computed } from "vue";

import { ElMessage, ElForm, type FormRules } from "element-plus";

import { saveOrUpdate } from "@/api/process/process-management/process-form";

import { ProcessDefinitionForm } from "@/model/process/process-management/process-form";

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
  (e: "refresh"): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    isEdit?: boolean;
    formData?: ProcessDefinitionForm;
  }>(),
  {
    dialogVisible: false,
    isEdit: false,
  }
);

const title = `${props.isEdit ? "编辑" : "新增"} 表单`;

const form = ref(ElForm);
const formData = ref(new ProcessDefinitionForm());

const rules = ref<FormRules>({
  name: [{ required: true, message: "表单名称不能为空", trigger: "blur" }],
  formKey: [{ required: true, message: "表单key不能为空", trigger: "blur" }],
});

const comfirmBtnLoading = ref<boolean>(false);

const dialogVisible = computed({
  get() {
    return props.dialogVisible;
  },
  set(value) {
    emit("update:dialogVisible", value);
  },
});

function closeDialog() {
  emit("update:dialogVisible", false);
}

function handleComfirm() {
  form.value.validate((valid: boolean) => {
    if (valid) {
      if (formData.value.builtIn === 1 && !formData.value.componentPath) {
        ElMessage.error("内置表单组件路径不能为空");
        return;
      }
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

onMounted(async () => {
  if (props.isEdit) {
    formData.value = JSON.parse(JSON.stringify(props.formData));
  }
});
</script>

<template>
  <el-dialog v-model="dialogVisible" draggable :title="title" :before-close="closeDialog" width="700px">
    <el-form ref="form" :model="formData" :rules="rules" label-width="85px">
      <el-form-item label="表单名称" prop="name">
        <el-input v-model="formData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="表单key" prop="name">
        <el-input v-model="formData.formKey" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否内置">
        <el-radio-group v-model="formData.builtIn">
          <el-radio-button :label="1">是</el-radio-button>
          <el-radio-button :label="0">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.builtIn === 1" label="组件路径" prop="componentPath">
        <el-input v-model="formData.componentPath" autocomplete="off" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="formData.description" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="handleComfirm" :loading="comfirmBtnLoading">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
