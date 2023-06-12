import { defineComponent, ref } from "vue";

import { ElButton, ElButtonGroup, ElTooltip } from "element-plus";

import type Modeler from "bpmn-js/lib/Modeler";
import type Canvas from "diagram-js/lib/core/Canvas";
import type { CanvasEvent } from "diagram-js/lib/core/EventBus";

import { useI18n } from "vue-i18n";

import EventEmitter from "@/util/workflow/EventEmitter";

import LucideIcon from "@/components/workflow/process-designer/common/LucideIcon.vue";

const Scales = defineComponent({
  name: "Scales",
  setup() {
    const { t } = useI18n();
    const currentScale = ref(1);
    let canvas: Canvas | null = null;

    EventEmitter.on("modeler-init", (modeler: Modeler) => {
      try {
        canvas = modeler.get<Canvas>("canvas");
        currentScale.value = canvas.zoom();
      } finally {
        modeler.on(
          "canvas.viewbox.changed",
          ({ viewbox }: CanvasEvent<any>) => {
            currentScale.value = viewbox.scale;
          }
        );
      }
    });

    const zoomReset = (newScale: number | string) => {
      canvas &&
        canvas.zoom(
          newScale,
          newScale === "fit-viewport" ? undefined : { x: 0, y: 0 }
        );
    };

    const zoomOut = (newScale?: number) => {
      currentScale.value =
        newScale || Math.floor(currentScale.value * 100 - 0.1 * 100) / 100;
      zoomReset(currentScale.value);
    };

    const zoomIn = (newScale?: number) => {
      currentScale.value =
        newScale || Math.floor(currentScale.value * 100 + 0.1 * 100) / 100;
      zoomReset(currentScale.value);
    };

    return () => (
      <ElButtonGroup style="margin-left: 10px;">
        <ElTooltip
          content={t("toolbar.zoomOut")}
          effect="dark"
          placement="bottom"
        >
          <ElButton onClick={() => zoomOut()}>
            <LucideIcon name="ZoomOut" size={16}></LucideIcon>
          </ElButton>
        </ElTooltip>
        <ElTooltip
          content={t("toolbar.zoomReset")}
          effect="dark"
          placement="bottom"
        >
          <ElButton onClick={() => zoomReset("fit-viewport")}>
            <span style="text-align: center; display: inline-block; width: 40px">
              {Math.floor(currentScale.value * 10) * 10 + "%"}
            </span>
          </ElButton>
        </ElTooltip>
        <ElTooltip
          content={t("toolbar.zoomIn")}
          effect="dark"
          placement="bottom"
        >
          <ElButton onClick={() => zoomIn()}>
            <LucideIcon name="ZoomIn" size={16}></LucideIcon>
          </ElButton>
        </ElTooltip>
      </ElButtonGroup>
    );
  },
});

export default Scales;
