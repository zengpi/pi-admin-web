<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";

import { SetUp } from "@element-plus/icons-vue";

import modeler from "@/stores/workflow/modeler";
import type { Base } from "diagram-js/lib/model";
import { scriptTypeOptions } from "@/config/workflow/selectOptions";
import * as CU from "@/util/workflow/bo-utils/conditionUtil";
import EventEmitter from "@/util/workflow/EventEmitter";

import CollapseTitle from "@/components/workflow/process-designer/common/CollapseTitle.vue";

export default defineComponent({
  name: "ElementConditional",
  components: {
    SetUp,
    CollapseTitle,
  },
  setup() {
    const modelerStore = modeler();
    const getActive = computed<Base | null>(() => modelerStore.getActive!);

    // 变量配置部分
    const varVisible = ref<boolean>(false);
    const variableName = ref<string | undefined>(undefined);
    const varEventVisible = ref<boolean>(false);
    const variableEvents = ref<string | undefined>(undefined);
    const getElementVariables = () => {
      varVisible.value = CU.isConditionEventDefinition(getActive.value!);
      variableName.value = CU.getVariableNameValue(getActive.value!);
      if (varVisible.value) {
        varEventVisible.value = !CU.isExtendStartEvent(getActive.value!);
        variableEvents.value = CU.getVariableEventsValue(getActive.value!);
      }
    };
    const setElementVariableName = (value: string | undefined) => {
      CU.setVariableNameValue(getActive.value!, value);
    };
    const setElementVariableEvents = (value: string | undefined) => {
      CU.setVariableEventsValue(getActive.value!, value);
    };

    // 条件类型配置部分
    const conditionTypeOptions = ref<Record<string, string>[]>([]);
    const conditionData = ref<ConditionalForm>({});
    const getElementConditionType = () => {
      conditionData.value.conditionType = CU.getConditionTypeValue(
        getActive.value!
      );
      conditionData.value.conditionType === "expression" &&
        getConditionExpression();
      conditionData.value.conditionType === "script" && getConditionScript();
    };
    const setElementConditionType = (value: string) => {
      CU.setConditionTypeValue(getActive.value!, value);
    };

    const getConditionExpression = () => {
      conditionData.value.expression = CU.getConditionExpressionValue(
        getActive.value!
      );
    };
    const setConditionExpression = (value: string | undefined) => {
      CU.setConditionExpressionValue(getActive.value!, value);
    };

    const getConditionScript = () => {
      conditionData.value.language = CU.getConditionScriptLanguageValue(
        getActive.value!
      );
      conditionData.value.scriptType = CU.getConditionScriptTypeValue(
        getActive.value!
      );
      conditionData.value.body = CU.getConditionScriptBodyValue(
        getActive.value!
      );
      conditionData.value.resource = CU.getConditionScriptResourceValue(
        getActive.value!
      );
    };
    const setConditionScriptLanguage = (value: string | undefined) => {
      CU.setConditionScriptLanguageValue(getActive.value!, value);
    };
    const setElementConditionScriptType = (value: string | undefined) => {
      CU.setConditionScriptTypeValue(getActive.value!, value);
    };
    const setConditionScriptBody = (value: string | undefined) => {
      CU.setConditionScriptBodyValue(getActive.value!, value);
    };
    const setConditionScriptResource = (value: string | undefined) => {
      CU.setConditionScriptResourceValue(getActive.value!, value);
    };

    onMounted(() => {
      getElementVariables();
      getElementConditionType();
      conditionTypeOptions.value = CU.getConditionTypeOptions(getActive.value!);
      EventEmitter.on("element-update", () => {
        conditionTypeOptions.value = CU.getConditionTypeOptions(
          getActive.value!
        );
        getElementVariables();
        getElementConditionType();
      });
    });

    return {
      varVisible,
      varEventVisible,
      variableName,
      variableEvents,
      setElementVariableName,
      setElementVariableEvents,
      conditionTypeOptions,
      conditionData,
      scriptTypeOptions,
      setElementConditionType,
      setConditionExpression,
      setConditionScriptLanguage,
      setElementConditionScriptType,
      setConditionScriptBody,
      setConditionScriptResource,
    };
  },
});
</script>

<template>
  <ElCollapseItem name="element-conditional">
    <template #title>
      <CollapseTitle :title="$t('panel.conditionalSettings')">
        <el-icon class="header-icon">
          <SetUp />
        </el-icon>
      </CollapseTitle>
    </template>
    <div class="element-conditional">
      <el-form label-width="120px" @submit.prevent>
        <template v-if="varVisible">
          <el-form-item
            key="variableName"
            :label="$t('panel.variableName')"
            :label-width="120"
          >
            <el-input
              v-model="variableName"
              maxlength="32"
              @change="setElementVariableName"
            />
          </el-form-item>
          <el-form-item
            v-if="varEventVisible"
            key="variableEvent"
            :label="$t('panel.variableEvents')"
            :label-width="120"
          >
            <el-input
              v-model="variableEvents"
              @change="setElementVariableEvents"
            />
          </el-form-item>
        </template>
        <el-form-item
          key="condition"
          :label="$t('panel.conditionType')"
          :label-width="120"
        >
          <el-select
            v-model="conditionData.conditionType"
            @update="setElementConditionType"
          >
            <el-option
              v-for="item in conditionTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            conditionData.conditionType &&
            conditionData.conditionType === 'expression'
          "
          key="expression"
          :label="$t('panel.conditionExpression')"
          :label-width="120"
        >
          <el-input
            v-model="conditionData.expression"
            @change="setConditionExpression"
          />
        </el-form-item>
        <template
          v-if="
            conditionData.conditionType &&
            conditionData.conditionType === 'script'
          "
        >
          <el-form-item
            key="scriptType"
            :label="$t('panel.scriptType')"
            :label-width="120"
          >
            <el-select
              v-model="conditionData.scriptType"
              :options="scriptTypeOptions"
              @update="setElementConditionScriptType"
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
            key="scriptLanguage"
            :label="$t('panel.scriptLanguage')"
            :label-width="120"
          >
            <el-input
              v-model="conditionData.language"
              @change="setConditionScriptLanguage"
            />
          </el-form-item>
          <el-form-item
            v-show="conditionData.scriptType === 'inline'"
            key="scriptBody"
            :label="$t('panel.scriptBody')"
            :label-width="120"
          >
            <el-input
              v-model="conditionData.body"
              type="textarea"
              @change="setConditionScriptBody"
            />
          </el-form-item>
          <el-form-item
            v-show="conditionData.scriptType === 'external'"
            key="scriptResource"
            :label="$t('panel.scriptResource')"
            :label-width="120"
          >
            <el-input
              v-model="conditionData.resource"
              @change="setConditionScriptResource"
            />
          </el-form-item>
        </template>
      </el-form>
    </div>
  </ElCollapseItem>
</template>
