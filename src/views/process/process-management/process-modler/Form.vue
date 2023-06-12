<script setup lang="ts" name="Form">
import { ref, onMounted, computed } from "vue";

import { ElForm, ElMessage, type FormRules } from "element-plus";
import { Search } from "@element-plus/icons-vue";

import { saveModel, updateModel } from "@/api/process-management/process-model";

import { ProcessModel } from "@/model/process-management/process-model";
import {
  ProcessCategory,
  ProcessCategoryDialog,
} from "@/model/process-management/process-category";

import ProcessCategorySelect from "@/views/process/process-management/process-category/components/ProcessCategorySelect.vue";

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
  (e: "refresh"): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    isEdit?: boolean;
    formData?: ProcessModel;
  }>(),
  {
    dialogVisible: false,
    isEdit: false,
  }
);

const title = `${props.isEdit ? "编辑" : "新增"} 流程模型`;

const form = ref(ElForm);
const formData = ref(new ProcessModel());

const rules = ref<FormRules>({
  key: [{ required: true, message: "模型标识不能为空", trigger: "blur" }],
  name: [{ required: true, message: "模型名称不能为空", trigger: "blur" }],
});

const comfirmLoading = ref<boolean>(false);

const processCategoryDialog = ref(new ProcessCategoryDialog());

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
      comfirmLoading.value = true;

      if (props.isEdit === true) {
        updateModel(formData.value)
          .then(() => {
            ElMessage.success(`编辑成功`);
            closeDialog();
            emit("refresh");
          })
          .catch(() => {});
      } else {
        saveModel(formData.value)
          .then(() => {
            ElMessage.success(`新增成功`);
            closeDialog();
            emit("refresh");
            comfirmLoading.value = false;
          })
          .catch(() => {
            comfirmLoading.value = false;
          });
      }
    }
  });
}

onMounted(async () => {
  if (props.isEdit) {
    formData.value = JSON.parse(JSON.stringify(props.formData));
  }
});

function handleCategorySelect() {
  processCategoryDialog.value.dialogVisiable = true;
}

function handleSelect(row: ProcessCategory) {
  formData.value.category = row.name;
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    draggable
    :title="title"
    :before-close="closeDialog"
    width="500px"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="85px">
      <el-form-item label="模型标识" prop="key">
        <el-input
          v-model="formData.key"
          autocomplete="off"
          :disabled="isEdit"
        />
      </el-form-item>
      <el-form-item label="模型名称" prop="name">
        <el-input v-model="formData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="流程分类" prop="category">
        <el-input v-model="formData.category" readonly>
          <template #append>
            <el-button :icon="Search" @click="handleCategorySelect" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          type="textarea"
          v-model="formData.metaInfo.description"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
          type="primary"
          @click="handleComfirm"
          :loading="comfirmLoading"
          >确认</el-button
        >
      </span>
    </template>

    <ProcessCategorySelect
      v-model:dialog-visible="processCategoryDialog.dialogVisiable"
      @select="handleSelect"
    />
  </el-dialog>
</template>
