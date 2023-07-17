<script setup lang="ts" name="StartProcessDialog">
/**
 * 启动流程窗口
 * @author ZnPi
 * @date 2023-01-20
 */
import { ref, onMounted, computed, markRaw, defineAsyncComponent } from "vue";

import { ElForm, ElMessage } from "element-plus";
import { CircleCheck, RefreshLeft } from "@element-plus/icons-vue";

import router from "@/router";

import FormComponentFactory from "@/components/workflow/form/form-component"

import { startProcessInstance } from "@/api/process/process-center/process-instance";
import { getProcessDefinitionStartForm } from "@/api/process/process-management/process-definition";
import { getBpmnXml } from "@/api/process/process-management/process-definition";

import { FormField, ProcessDefinitionForm } from "@/model/process/process-management/process-form";
import { StartProcessInstanceForm } from "@/model/process/process-center/process-instance";

import ProcessViewer from "@/components/workflow/ProcessViewer.vue";
import { BuiltInFormEnum } from "@/model/enums/components/workflow";

const BUILT_IN_FORM_PATH = "/src/components/workflow/form/built-in-form"

const formComponents = import.meta.glob("@/components/workflow/form/built-in-form/**/*.vue");

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    processDefinitionId: string;
    processDefinitionName: string;
  }>(),
  {
    dialogVisible: false,
  }
);

const title = `发起流程`;
const builtInFormRef = ref(ElForm);
const formRef = ref(ElForm);
const submitBtnLoading = ref(false);

const form = ref<ProcessDefinitionForm>(new ProcessDefinitionForm());

const collapseActiveNames = ref(["1", "2", "3"]);

const bpmnXml = ref("");

const dialogVisible = computed({
  get() {
    return props.dialogVisible;
  },
  set(value) {
    emit("update:dialogVisible", value);
  },
});

onMounted(() => {
  getProcessDefinitionStartForm(props.processDefinitionId)
    .then(({ data }) => {
      if (data.builtIn === BuiltInFormEnum.BUILT_IN) {
        data.formComponent = markRaw(
          defineAsyncComponent(
            formComponents[
            `${BUILT_IN_FORM_PATH}/${data.componentPath}.vue`
            ] as any
          )
        );
      }
      form.value = data;
    })
    .catch((err) => {
      console.error(err);
    });
  getBpmnXml(props.processDefinitionId)
    .then(({ data }) => {
      bpmnXml.value = data;
    })
    .catch((err) => {
      console.error(err);
    });
});

function closeDialog() {
  dialogVisible.value = false;
}

async function handleSubmit() {
  if (form.value.builtIn === BuiltInFormEnum.BUILT_IN) {
    if (!builtInFormRef.value) return;
    await builtInFormRef.value.form.validate((valid: boolean) => {
      if (valid) {
        let startProcessInstanceForm = new StartProcessInstanceForm();
        startProcessInstanceForm.processDefinitionId = props.processDefinitionId
        startProcessInstanceForm.processDefinitionName = props.processDefinitionName
        startProcessInstanceForm.variables = builtInFormRef.value.formData;
        startProcessInstanceForm.isBuiltInForm = BuiltInFormEnum.BUILT_IN;
        startProcessInstance(
          startProcessInstanceForm
        ).then(() => {
          ElMessage.success("提交成功");
          closeDialog();
          router.push({ path: "/process/process-center/my-process" });
        });
      }
    });
  } else {
    if (!formRef.value) return;
    await formRef.value.validate((valid: boolean) => {
      if (valid) {
        let variables = {}

        form.value.fields?.forEach(field => {
          variables[field.id!] = field.value;
        })
        let startProcessInstanceForm = new StartProcessInstanceForm();
        startProcessInstanceForm.processDefinitionId = props.processDefinitionId
        startProcessInstanceForm.processDefinitionName = props.processDefinitionName
        startProcessInstanceForm.variables = variables;
        startProcessInstanceForm.isBuiltInForm = BuiltInFormEnum.NOT_BUILT_IN
        startProcessInstance(
          startProcessInstanceForm
        ).then(() => {
          ElMessage.success("提交成功");
          closeDialog();
          router.push({ path: "/process/process-center/my-process" });
        });
      }
    });
  }
}

function handleReset() {
  if (form.value.builtIn === BuiltInFormEnum.BUILT_IN) {
    if (!builtInFormRef.value) return;
    builtInFormRef.value.form.resetFields();
  } else {
    if (!formRef.value) return;
    formRef.value.resetFields();
  }
}

function getFieldClass(field: FormField) {

}

function getRules(field: FormField) {
  const rules: object[] = [{
    required: !!field.required,
    message: field.name + '不能为空',
    trigger: ['change', 'input', 'blur'],
  }];
  return rules;
}

function getFieldComponent(field: FormField) {
  return FormComponentFactory.getComponent(field.type);
}
</script>

<template>
  <el-dialog v-model="dialogVisible" draggable :title="title" :before-close="closeDialog" width="80%" fullscreen>
    <el-collapse v-model="collapseActiveNames">
      <el-collapse-item title="表单信息" name="2">
        <el-card shadow="hover">
          <template #header>
            <span>{{ form.name }}</span>
            <el-tag v-if="form.version" type="warning" effect="dark" class="form-name-tag">
              v{{ form.version }}
            </el-tag>
          </template>
          <component ref="builtInFormRef" v-if="form.builtIn === BuiltInFormEnum.BUILT_IN && form.formComponent"
            :is="form.formComponent">
          </component>
          <template v-else>
            <el-form label-position="right" :model="form" ref="formRef" label-width="10em" label-suffix=":">
              <el-row :gutter="10">
                <el-col :span="8" v-for="(field, index) in form.fields" :key="field.id">
                  <el-form-item :class="getFieldClass(field)" :label="field.name" :prop="'fields.' + index + '.value'"
                    :rules="getRules(field)">
                    <component :ref="field.id" :is="getFieldComponent(field)" v-model:value="field.value"
                      :options="field.options" :readonly="field.readOnly!">
                    </component>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-card>
        <el-row :gutter="10" type="flex" justify="center" style="margin-top: 20px">
          <el-col :span="1.5">
            <el-button :icon="CircleCheck" type="success" @click="handleSubmit" :loading="submitBtnLoading">提交</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button :icon="RefreshLeft" type="primary" @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="流程" name="3">
        <ProcessViewer v-if="bpmnXml" :bpmn-xml="bpmnXml" />
      </el-collapse-item>
    </el-collapse>
  </el-dialog>
</template>

<style lang="scss" scoped>
.form-name-tag {
  margin-left: 10px;
}
</style>
