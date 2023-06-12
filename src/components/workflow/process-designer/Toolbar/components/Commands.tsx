import { defineComponent } from "vue";

import type Modeler from "bpmn-js/lib/Modeler";
import type CommandStack from "diagram-js/lib/command/CommandStack";

import { useI18n } from "vue-i18n";

import EventEmitter from "@/util/workflow/EventEmitter";
import { createNewDiagram } from "@/util/workflow";

import LucideIcon from "@/components/workflow/process-designer/common/LucideIcon.vue";
import { ElButton, ElButtonGroup, ElTooltip } from "element-plus";

const Commands = defineComponent({
  name: "Commands",
  setup() {
    const { t } = useI18n();
    let command: CommandStack | null = null;

    EventEmitter.on("modeler-init", (modeler: Modeler) => {
      command = modeler.get<CommandStack>("commandStack");
    });

    const undo = () => {
      command && command.canUndo() && command.undo();
    };

    const redo = () => {
      command && command.canRedo() && command.redo();
    };

    const restart = () => {
      command && command.clear();
      createNewDiagram();
    };

    return () => (
      <ElButtonGroup style="margin-left: 10px">
        <ElTooltip content={t("toolbar.undo")} effect="dark" placement="bottom">
          <ElButton onClick={undo}>
            <LucideIcon name="Undo2" size={16}></LucideIcon>
          </ElButton>
        </ElTooltip>
        <ElTooltip content={t("toolbar.redo")} effect="dark" placement="bottom">
          <ElButton onClick={redo}>
            <LucideIcon name="Redo2" size={16}></LucideIcon>
          </ElButton>
        </ElTooltip>
        <ElTooltip
          content={t("toolbar.restart")}
          effect="dark"
          placement="bottom"
        >
          <ElButton onClick={restart}>
            <LucideIcon name="Eraser" size={16}></LucideIcon>
          </ElButton>
        </ElTooltip>
      </ElButtonGroup>
    );
  },
});

export default Commands;
