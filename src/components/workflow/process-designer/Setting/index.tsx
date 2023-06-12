import { defineComponent, type PropType, ref, toRaw, watch } from "vue";

import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElRadioGroup,
  ElRadio,
  ElSwitch,
  ElInput,
  ElColorPicker,
  ElInputNumber,
} from "element-plus";

import { useI18n } from "vue-i18n";

import type { EditorSettings } from "@/types/workflow/editor/settings";

import { defaultSettings } from "@/config/workflow";

import editor from "@/stores/workflow/editor";

import LucideIcon from "@/components/workflow/process-designer/common/LucideIcon.vue";

const props = {
  settings: {
    type: Object as PropType<EditorSettings>,
    default: () => defaultSettings,
  },
};

const Setting = defineComponent({
  name: "Setting",
  props: props,
  emits: ["update:settings"],
  setup(props) {
    const { t, locale } = useI18n();

    const modelVisible = ref(false);
    const editorStore = editor();

    const themeColorKeys = [
      "defaultFillColor",
      "defaultStartEventColor",
      "defaultEndEventColor",
      "defaultIntermediateEventColor",
      "defaultIntermediateThrowEventColor",
      "defaultIntermediateCatchEventColor",
      "defaultTaskColor",
      "defaultLabelColor",
      "defaultGatewayColor",
      "defaultSequenceColor",
    ];
    const themeOpacityKeys = [
      "defaultStartEventOpacity",
      "defaultEndEventOpacity",
      "defaultIntermediateThrowEventOpacity",
      "defaultIntermediateCatchEventOpacity",
      "defaultTaskOpacity",
      "defaultLabelOpacity",
      "defaultGatewayOpacity",
      "defaultSequenceOpacity",
    ];
    const editorSettings = ref(props.settings);
    const changeModelVisible = (event: any) => {
      event.stopPropagation();
      modelVisible.value = !modelVisible.value;
    };

    watch(
      () => editorSettings.value,
      () => {
        if (editorSettings.value.penalMode !== "custom") {
          editorSettings.value.processEngine = "camunda";
        }
        locale.value = editorSettings.value.language;
        editorSettings.value &&
          editorStore.updateConfiguration(toRaw(editorSettings.value));
      },
      { deep: true }
    );

    return () => (
      <div class="setting" onClick={(e) => e.stopPropagation()}>
        <div class="toggle-button" onClick={changeModelVisible}>
          <LucideIcon name="Settings" size={40} color="#ffffff"></LucideIcon>
        </div>

        <ElDialog
          v-model={modelVisible.value}
          title={t("configForm.preferences")}
          append-to-body
          destroy-on-close
          draggable
          width="560px"
          top="60px"
        >
          <ElForm labelAlign="right" labelPlacement="left">
            <ElFormItem label={t("configForm.language")}>
              <ElRadioGroup v-model={[editorSettings.value.language, "value"]}>
                <ElRadio value="zh_CN">简体中文</ElRadio>
                <ElRadio value="en_US">English</ElRadio>
              </ElRadioGroup>
            </ElFormItem>
            <ElFormItem label={t("configForm.processName")}>
              <ElInput
                v-model={[editorSettings.value.processName, "value"]}
                clearable={true}
              ></ElInput>
            </ElFormItem>
            <ElFormItem label={t("configForm.processId")}>
              <ElInput
                v-model={[editorSettings.value.processId, "value"]}
                clearable={true}
              ></ElInput>
            </ElFormItem>
            <ElFormItem label={t("configForm.toolbar")}>
              <ElSwitch
                v-model={[editorSettings.value.toolbar, "value"]}
              ></ElSwitch>
            </ElFormItem>
            <ElFormItem label={t("configForm.miniMap")}>
              <ElSwitch
                v-model={[editorSettings.value.miniMap, "value"]}
              ></ElSwitch>
            </ElFormItem>
            <ElFormItem label={t("configForm.useLint")}>
              <ElSwitch
                v-model={[editorSettings.value.useLint, "value"]}
              ></ElSwitch>
            </ElFormItem>
            <ElFormItem label={t("configForm.templateChooser")}>
              <ElSwitch
                v-model={[editorSettings.value.templateChooser, "value"]}
              ></ElSwitch>
            </ElFormItem>
            <ElFormItem
              label={t("configForm.contextmenu")}
              feedback={t(
                "configForm.there_are_different_states_under_TemplateChooser"
              )}
            >
              <ElSwitch
                v-model={[editorSettings.value.contextmenu, "value"]}
              ></ElSwitch>
            </ElFormItem>
            <ElFormItem label={t("configForm.customContextmenu")}>
              <ElSwitch
                v-model={[editorSettings.value.customContextmenu, "value"]}
              ></ElSwitch>
            </ElFormItem>
            <ElFormItem label={t("configForm.processEngine")}>
              <ElRadioGroup
                v-model={[editorSettings.value.processEngine, "value"]}
              >
                <ElRadio value="camunda">{t("configForm.Camunda")}</ElRadio>
                <ElRadio value="activiti">{t("configForm.Activeti")}</ElRadio>
                <ElRadio value="flowable">{t("configForm.Flowable")}</ElRadio>
              </ElRadioGroup>
            </ElFormItem>
            <ElFormItem label={t("configForm.background")}>
              <ElRadioGroup v-model={[editorSettings.value.bg, "value"]}>
                <ElRadio value="grid-image">
                  {t("configForm.gridImage")}
                </ElRadio>
                <ElRadio value="grid">{t("configForm.grid")}</ElRadio>
                <ElRadio value="image">{t("configForm.image")}</ElRadio>
                <ElRadio value="none">{t("configForm.none")}</ElRadio>
              </ElRadioGroup>
            </ElFormItem>
            <ElFormItem label={t("configForm.penalMode")}>
              <ElRadioGroup v-model={[editorSettings.value.penalMode, "value"]}>
                <ElRadio value="default">{t("configForm.default")}</ElRadio>
                <ElRadio value="rewrite" disabled={true}>
                  {t("configForm.rewrite")}
                </ElRadio>
                <ElRadio value="custom">{t("configForm.custom")}</ElRadio>
              </ElRadioGroup>
            </ElFormItem>
            <ElFormItem label={t("configForm.paletteMode")}>
              <ElRadioGroup
                v-model={[editorSettings.value.paletteMode, "value"]}
              >
                <ElRadio value="default">{t("configForm.default")}</ElRadio>
                <ElRadio value="rewrite">{t("configForm.rewrite")}</ElRadio>
                <ElRadio value="enhancement">
                  {t("configForm.enhancement")}
                </ElRadio>
                <ElRadio value="custom">{t("configForm.custom")}</ElRadio>
              </ElRadioGroup>
            </ElFormItem>
            <ElFormItem label={t("configForm.contextPadMode")}>
              <ElRadioGroup
                v-model={[editorSettings.value.contextPadMode, "value"]}
              >
                <ElRadio value="default">{t("configForm.default")}</ElRadio>
                <ElRadio value="rewrite">{t("configForm.rewrite")}</ElRadio>
                <ElRadio value="enhancement">
                  {t("configForm.enhancement")}
                </ElRadio>
              </ElRadioGroup>
            </ElFormItem>
            <ElFormItem label={t("configForm.rendererMode")}>
              <ElRadioGroup
                v-model={[editorSettings.value.rendererMode, "value"]}
              >
                <ElRadio value="default">{t("configForm.default")}</ElRadio>
                <ElRadio value="rewrite">{t("configForm.rewrite")}</ElRadio>
                <ElRadio value="enhancement">
                  {t("configForm.enhancement")}
                </ElRadio>
              </ElRadioGroup>
            </ElFormItem>
            <ElFormItem
              label={t("configForm.otherModule")}
              feedback="AutoPlace, Rules ..."
            >
              <ElSwitch
                v-model={[editorSettings.value.otherModule, "value"]}
              ></ElSwitch>
            </ElFormItem>
            {editorSettings.value.rendererMode === "rewrite" && (
              <ElFormItem
                label={t("configForm.customTheme")}
                class="theme-list"
                labelAlign="left"
                labelPlacement="top"
              >
                {themeColorKeys.map((key) => {
                  return (
                    <div class="theme-item">
                      <div class="theme-item_label">{key}：</div>
                      <ElColorPicker
                        modes={["hex"]}
                        showAlpha={false}
                        v-model={editorSettings.value.customTheme[key]}
                      ></ElColorPicker>
                    </div>
                  );
                })}
                {themeOpacityKeys.map((key) => {
                  return (
                    <div class="theme-item">
                      <div class="theme-item_label">{key}：</div>
                      <ElInputNumber
                        v-model={editorSettings.value.customTheme[key]}
                      ></ElInputNumber>
                    </div>
                  );
                })}
              </ElFormItem>
            )}
          </ElForm>
        </ElDialog>
      </div>
    );
  },
});

export default Setting;
