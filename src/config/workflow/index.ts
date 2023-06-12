import type { EditorSettings } from "@/types/workflow/editor/settings";
import { getLocale } from "@/locale";

export const defaultSettings: EditorSettings = {
  language: getLocale(),
  processId: `Process_${new Date().getTime()}`,
  processName: `业务流程`,
  processEngine: "camunda",
  paletteMode: "enhancement",
  penalMode: "custom",
  contextPadMode: "enhancement",
  rendererMode: "rewrite",
  bg: "grid-image",
  toolbar: true,
  miniMap: true,
  contextmenu: true,
  customContextmenu: true,
  otherModule: true,
  templateChooser: true,
  useLint: false,
  customTheme: {},
};
