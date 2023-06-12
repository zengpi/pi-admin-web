<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import { ElForm, ElMessage, type FormRules } from "element-plus";

import { Package } from "@/model/system/package";

import { saveOrUpdate } from "@/api/system/package";

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
  (e: "refresh"): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    isEdit?: boolean;
    formData?: Package;
  }>(),
  {
    dialogVisible: false,
    isEdit: false,
  }
);

const title = `${props.isEdit ? "编辑" : "新增"} 套餐`;

const form = ref(ElForm);
const formData = ref(new Package());
const rules = ref<FormRules>({
  name: [{ required: true, message: "套餐名称不能为空", trigger: "blur" }],
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
    width="500px"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="套餐名称" prop="name">
        <el-input v-model="formData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-radio-group v-model="formData.enabled">
          <el-radio-button :label="1">启用</el-radio-button>
          <el-radio-button :label="0">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          v-model="formData.remark"
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
          :loading="comfirmBtnLoading"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
