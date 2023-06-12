<script lang="ts">
import {
  defineComponent,
  h,
  markRaw,
  ref,
  computed,
  nextTick,
  onMounted,
} from "vue";

import { ElForm, type FormRules, ElButton } from "element-plus";
import { View } from "@element-plus/icons-vue";

import type { ModdleElement } from "bpmn-moddle";
import type { Base } from "diagram-js/lib/model";

import { useI18n } from "vue-i18n";

import modeler from "@/stores/workflow/modeler";

import {
  addExecutionListener,
  getDefaultEvent,
  getExecutionListeners,
  getExecutionListenerType,
  getExecutionListenerTypes,
  removeExecutionListener,
  updateExecutionListener,
} from "@/util/workflow/bo-utils/executionListenersUtil";
import { getScriptType } from "@/util/workflow/bo-utils/scriptUtil";
import EventEmitter from "@/util/workflow/EventEmitter";

import CollapseTitle from "@/components/workflow/process-designer/common/CollapseTitle.vue";

export default defineComponent({
  name: "ElementExecutionListeners",
  components: {
    View,
    CollapseTitle,
  },
  setup() {
    const { t } = useI18n();
    const modelerStore = modeler();
    const getActive = computed(() => modelerStore.getActive!);
    const getActiveId = computed<string>(() => modelerStore.getActiveId!);
    let listenersRaw = markRaw([]);
    let activeIndex = -1;

    const modelVisible = ref(false);
    const listeners = ref<ExecutionListenerForm[]>([]);
    const newListener = ref<ExecutionListenerForm>({
      event: "",
      type: "class",
    });
    const formRef = ref(ElForm);
    const formItemVisible = ref<FormItemVisible>({
      listenerType: "class",
      scriptType: "none",
    });

    const listenerEventTypeOptions = ref<Record<string, string>[]>([
      { label: "Start", value: "start" },
      { label: "End", value: "end" },
      { label: "Take", value: "take" },
    ]);
    const listenerTypeOptions = ref<Record<string, string>[]>([
      { label: "Java Class", value: "class" },
      { label: "Expression", value: "expression" },
      { label: "DelegateExpression", value: "delegateExpression" },
      { label: "Script", value: "script" },
    ]);
    const scriptTypeOptions = ref<Record<string, string>[]>([
      { label: "External Resource", value: "external" },
      { label: "Inline Script", value: "inline" },
      { label: "None", value: "none" },
    ]);
    const formRules: FormRules = {
      event: {
        required: true,
        trigger: ["blur", "change"],
        message: "事件类型不能为空",
      },
      type: {
        required: true,
        trigger: ["blur", "change"],
        message: "监听器类型不能为空",
      },
    };
    const columns: any = computed(() => [
      {
        title: t("panel.index"),
        key: "index",
        render: (a, index) => index + 1,
        width: 60,
      },
      { title: "EventType", key: "event", ellipsis: { tooltip: true } },
      { title: "ListenerType", key: "type", ellipsis: { tooltip: true } },
      {
        title: t("panel.operations"),
        key: "operation",
        width: 140,
        align: "center",
        render: (row, index) =>
          h("span", {}, [
            h(
              ElButton,
              {
                size: "small",
                type: "warning",
                onClick: () => openListenerModel(index, row),
              },
              { default: () => t("panel.edit") }
            ),
            h(
              ElButton,
              {
                size: "small",
                type: "danger",
                onClick: () => removeListener(index),
              },
              { default: () => t("panel.remove") }
            ),
          ]),
      },
    ]);

    const updateListenerType = (value: string) => {
      formItemVisible.value.listenerType = value;
      newListener.value = {
        ...newListener.value,
        type: value,
        ...(value === "script"
          ? { script: newListener.value.script || {} }
          : {}),
      };
    };
    const updateScriptType = (value: string) => {
      formItemVisible.value.scriptType = value;
      newListener.value.script = {
        scriptFormat: newListener.value.script?.scriptFormat,
        scriptType: value,
      };
    };

    const reloadExtensionListeners = () => {
      modelVisible.value = false;
      updateListenerType("class");
      newListener.value = {
        event: getDefaultEvent(getActive.value),
        type: "class",
      };
      listenerEventTypeOptions.value = getExecutionListenerTypes(
        getActive.value
      );
      (listenersRaw as ModdleElement[]) = markRaw(
        getExecutionListeners(getActive.value as Base)
      );
      const list = listenersRaw.map(
        (
          item: ModdleElement & BpmnExecutionListener
        ): ExecutionListenerForm => ({
          ...item,
          ...(item.script
            ? {
                script: {
                  ...item.script,
                  scriptType: getScriptType(
                    item.script as ModdleElement & BpmnScript
                  ),
                },
              }
            : {}),
          type: getExecutionListenerType(item),
        })
      );
      listeners.value = JSON.parse(JSON.stringify(list));
    };

    const removeListener = (index: number) => {
      const listener: ModdleElement = listenersRaw[index];
      removeExecutionListener(getActive.value, listener);
      reloadExtensionListeners();
    };

    const saveExecutionListener = async () => {
      await formRef.value!.validate();
      activeIndex === -1
        ? addExecutionListener(getActive.value, newListener.value)
        : updateExecutionListener(
            getActive.value,
            newListener.value,
            listenersRaw[activeIndex]
          );
      reloadExtensionListeners();
    };

    const openListenerModel = async (
      index: number,
      listenerData?: ExecutionListenerForm
    ) => {
      activeIndex = index;
      listenerData &&
        (newListener.value = JSON.parse(JSON.stringify(listenerData)));
      updateListenerType(listenerData?.type || "class");
      modelVisible.value = true;
      await nextTick();
      formRef.value && formRef.value.resetFields();
    };

    onMounted(() => {
      reloadExtensionListeners();
      EventEmitter.on("element-update", reloadExtensionListeners);
    });

    return {
      modelVisible,
      getActiveId,
      getActive,
      formRef,
      listeners,
      newListener,
      formRules,
      columns,
      formItemVisible,
      listenerEventTypeOptions,
      listenerTypeOptions,
      scriptTypeOptions,
      removeListener,
      saveExecutionListener,
      openListenerModel,
      updateListenerType,
      updateScriptType,
    };
  },
});
</script>

<template>
  <ElCollapseItem name="element-execution-listeners">
    <template #title>
      <CollapseTitle :title="$t('panel.executionListeners')">
        <el-icon class="header-icon">
          <View />
        </el-icon>
      </CollapseTitle>
      <el-tag round style="margin: 0 0 0 auto">
        {{ listeners.length }}
      </el-tag>
    </template>
    <div class="element-extension-listeners">
      <el-table max-height="20vh" :data="listeners">
        <el-table-column :label="$t('panel.index')" type="index" width="60" />
        <el-table-column
          property="event"
          label="EventType"
          show-overflow-tooltip
        />
        <el-table-column
          property="type"
          label="ListenerType"
          show-overflow-tooltip
        />
        <el-table-column
          property="operation"
          :label="$t('panel.operations')"
          width="140"
          #default="{ row, $index }"
        >
          <el-button
            type="warning"
            link
            @click="openListenerModel($index, row)"
            >{{ $t("panel.edit") }}</el-button
          >
          <el-button type="danger" link @click="removeListener($index)">{{
            $t("panel.remove")
          }}</el-button>
        </el-table-column>
      </el-table>

      <el-button
        type="primary"
        class="inline-large-button"
        secondary
        @click="openListenerModel(-1)"
      >
        <lucide-icon :size="20" name="Plus" />
        <span>{{ $t("panel.addExecutionListener") }}</span>
      </el-button>
    </div>

    <el-dialog
      v-model="modelVisible"
      :title="$t('panel.addExecutionListener')"
      :style="{ width: '640px' }"
    >
      <el-form
        ref="formRef"
        :model="newListener"
        :rules="formRules"
        class="need-filled"
        label-position="top"
        label-width="100px"
      >
        <el-form-item
          prop="event"
          :label="$t('panel.executionListenerEventType')"
        >
          <el-select v-model="newListener.event">
            <el-option
              v-for="item in listenerEventTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="type" :label="$t('panel.executionListenerType')">
          <el-select v-model="newListener.type" @update="updateListenerType">
            <el-option
              v-for="item in listenerTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formItemVisible.listenerType === 'class'"
          prop="class"
          :label="$t('panel.javaClass')"
        >
          <el-input v-model="newListener.class" @keydown.enter.prevent />
        </el-form-item>
        <el-form-item
          v-if="formItemVisible.listenerType === 'expression'"
          prop="expression"
          :label="$t('panel.expression')"
        >
          <el-input v-model="newListener.expression" @keydown.enter.prevent />
        </el-form-item>
        <el-form-item
          v-if="formItemVisible.listenerType === 'delegateExpression'"
          prop="delegateExpression"
          :label="$t('panel.delegateExpression')"
        >
          <el-input
            v-model="newListener.delegateExpression"
            @keydown.enter.prevent
          />
        </el-form-item>
        <template
          v-if="formItemVisible.listenerType === 'script' && newListener.script"
        >
          <el-form-item
            key="scriptFormat"
            prop="script.scriptFormat"
            :label="$t('panel.scriptFormat')"
          >
            <el-input
              v-model="newListener.script.scriptFormat"
              @keydown.enter.prevent
            />
          </el-form-item>
          <el-form-item
            key="scriptType"
            prop="script.scriptType"
            :label="$t('panel.scriptType')"
          >
            <el-select
              v-model="newListener.script.scriptType"
              @update="updateScriptType"
            >
              <el-option
                v-for="item in scriptTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="formItemVisible.scriptType === 'inline'"
            key="scriptContent"
            prop="script.value"
            :label="$t('panel.scriptBody')"
          >
            <el-input
              v-model="newListener.script.value"
              type="textarea"
              @keydown.enter.prevent
            />
          </el-form-item>
          <el-form-item
            v-if="formItemVisible.scriptType === 'external'"
            key="scriptResource"
            prop="script.resource"
            :label="$t('panel.scriptResource')"
          >
            <el-input
              v-model="newListener.script.resource"
              @keydown.enter.prevent
            />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="saveExecutionListener">{{
          $t("panel.confirm")
        }}</el-button>
      </template>
    </el-dialog>
  </ElCollapseItem>
</template>
