import { computed, defineComponent, ref } from "vue";

import {
  ElButtonGroup,
  ElTooltip,
  ElButton,
  ElDialog,
  ElInput,
} from "element-plus";

import { useI18n } from "vue-i18n";

import type ToggleMode from "bpmn-js-token-simulation/lib/features/toggle-mode/modeler/ToggleMode";
import type EventBus from "diagram-js/lib/core/EventBus";

import editor from "@/stores/workflow/editor";
import modeler from "@/stores/workflow/modeler";

import LucideIcon from "@/components/workflow/process-designer/common/LucideIcon.vue";

const ExternalTools = defineComponent({
  name: "ExternalTools",
  setup() {
    const { t } = useI18n();
    const moduleStore = modeler();

    const eventsDialog = ref({
      dialogVisiable: false,
    });

    const shortcutKeysDialog = ref({
      dialogVisiable: false,
    });

    let minimap: any | null = null;
    const minimapStatus = computed(() => editor().getEditorConfig.miniMap);
    const minimapToggle = () => {
      !minimap && (minimap = moduleStore.getModeler!.get("minimap"));
      minimap && minimap.toggle();
    };

    const mockSimulation = () => {
      moduleStore.getModeler!.get<ToggleMode>("toggleMode").toggleMode();
    };

    let lintModule: any | null = null;
    const lintEnable = computed(() => editor().getEditorConfig.useLint);
    const lintToggle = () => {
      !lintModule && (lintModule = moduleStore.getModeler!.get("linting"));
      lintModule && lintModule.toggle();
    };

    const shortcutKeysEnable = computed(
      () => editor().getEditorConfig.otherModule
    );
    const templateExternal = computed(
      () => editor().getEditorConfig.templateChooser
    );

    const renderDefault = () => (
      <div class="shortcut-keys-model">
        <p>Undo</p>
        <p>Ctrl + Z</p>
        <p>Redo</p>
        <p>Ctrl + Shift + Z / ctrl + Y</p>
        <p>Select All</p>
        <p>Ctrl + A</p>
        <p>Zoom</p>
        <p>Ctrl + Mouse Wheel</p>
        <p>Scrolling (Vertical)</p>
        <p>Mouse Wheel</p>
        <p>Scrolling (Horizontal)</p>
        <p>Shift + Mouse Wheel</p>
        <p>Direct Editing</p>
        <p>E</p>
        <p>Hand Tool</p>
        <p>H</p>
        <p>Lasso Tool</p>
        <p>L</p>
        <p>Space Tool</p>
        <p>S</p>
      </div>
    );
    const renderTemplateExternal = () => (
      <div class="shortcut-keys-model">
        <p>Replace Tool</p>
        <p>R</p>
        <p>Append anything</p>
        <p>A</p>
        <p>Create anything</p>
        <p>N</p>
      </div>
    );

    const openShortcutKeysModel = () => {
      shortcutKeysDialog.value.dialogVisiable = true;
    };

    const listeners = ref<string[]>([]);
    const listenerFilter = ref<string>("");
    const visibleListeners = computed(() =>
      listeners.value.filter((i) => i.includes(listenerFilter.value))
    );
    const openEventsModel = () => {
      eventsDialog.value.dialogVisiable = true;
      const eventBus = moduleStore.getModeler!.get<EventBus>("eventBus");
      listenerFilter.value = "";
      listeners.value = Object.keys(eventBus._listeners).sort();
    };

    return () => (
      <>
        <ElButtonGroup style="margin-left: 10px">
          <ElTooltip
            content={t("toolbar.toggleProcessMock")}
            effect="dark"
            placement="bottom"
          >
            <ElButton onClick={mockSimulation}>
              <LucideIcon name="Bot" size={16}></LucideIcon>
            </ElButton>
          </ElTooltip>
          <ElTooltip
            content={t("toolbar.bpmnEvents")}
            effect="dark"
            placement="bottom"
          >
            <ElButton onClick={openEventsModel}>
              <LucideIcon name="Podcast" size={16}></LucideIcon>
            </ElButton>
          </ElTooltip>
          {minimapStatus.value && (
            <ElTooltip
              content={t("toolbar.toggleMinimap")}
              effect="dark"
              placement="bottom"
            >
              <ElButton onClick={() => minimapToggle()}>
                <LucideIcon name="Map" size={16}></LucideIcon>
              </ElButton>
            </ElTooltip>
          )}
          {lintEnable.value && (
            <ElTooltip
              content={t("toolbar.toggleProcessLint")}
              effect="dark"
              placement="bottom"
            >
              <ElButton onClick={() => lintToggle()}>
                <LucideIcon name="FileCheck" size={16}></LucideIcon>
              </ElButton>
            </ElTooltip>
          )}
          {shortcutKeysEnable.value && (
            <ElTooltip
              content={t("toolbar.bpmnShortcutKeys")}
              effect="dark"
              placement="bottom"
            >
              <ElButton onClick={() => openShortcutKeysModel()}>
                <LucideIcon name="Keyboard" size={16}></LucideIcon>
              </ElButton>
            </ElTooltip>
          )}
        </ElButtonGroup>
        <ElDialog
          v-model={eventsDialog.value.dialogVisiable}
          title={t("toolbar.bpmnEvents")}
          append-to-body
          destroy-on-close
          draggable
          width="560px"
          top="60px"
        >
          <div class="event-listeners-box">
            <div class="listener-search">
              <ElInput
                v-model={listenerFilter.value}
                clearable={true}
              ></ElInput>
            </div>
            <div class="event-listeners-box">
              {visibleListeners.value &&
                visibleListeners.value.map((name, key) => {
                  return (
                    <p class="listener-item">
                      {key + 1}：{name}
                    </p>
                  );
                })}
            </div>
          </div>
        </ElDialog>
        <ElDialog
          v-model={shortcutKeysDialog.value.dialogVisiable}
          title={t("toolbar.bpmnShortcutKeys")}
          append-to-body
          destroy-on-close
          draggable
          width="570px"
          top="60px"
        >
          <div>
            {renderDefault()}
            {templateExternal.value && renderTemplateExternal()}
          </div>
        </ElDialog>
      </>
    );
  },
});

export default ExternalTools;
