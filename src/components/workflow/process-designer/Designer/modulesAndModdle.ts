import { type Ref, toRaw } from "vue";
import type { ModuleDeclaration } from "didi";
import type { EditorSettings } from "@/types/workflow/editor/settings";

// ** 官方流程模拟 module
import TokenSimulationModule from "bpmn-js-token-simulation";

// moddle 定义文件
import activitiModdleDescriptors from "@/config/workflow/moddle-extensions/activiti.json";
import camundaModdleDescriptors from "@/config/workflow/moddle-extensions/camunda.json";
import flowableModdleDescriptors from "@/config/workflow/moddle-extensions/flowable.json";
import MiyueModdleDescriptors from "@/config/workflow/moddle-extensions/miyue.json";

// camunda 官方侧边栏扩展
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from "bpmn-js-properties-panel";

import CamundaExtensionModule from "camunda-bpmn-moddle/resources/camunda.json";

// 官方扩展工具 元素模板选择
// import ElementTemplateChooserModule from '@bpmn-io/element-template-chooser'
// import ConnectorsExtensionModule from 'bpmn-js-connectors-extension'

import Grid from "diagram-js/lib/features/grid-snapping/visuals";

// 自定义 modules 扩展模块
import translate from "@/util/workflow/additional-modules/Translate";
import Rules from "@/util/workflow/additional-modules/Rules";
import AutoPlace from "@/util/workflow/additional-modules/AutoPlace";
import ElementFactory from "@/util/workflow/additional-modules/ElementFactory";
import EnhancementPalette from "@/util/workflow/additional-modules/Palette/EnhancementPalette";
import RewritePalette from "@/util/workflow/additional-modules/Palette/RewritePalette";
import EnhancementContextPad from "@/util/workflow/additional-modules/ContextPad/EnhancementContextPad";
import RewriteContextPad from "@/util/workflow/additional-modules/ContextPad/RewriteContextPad";
import EnhancementRenderer from "@/util/workflow/additional-modules/Renderer/EnhancementRenderer";
import RewriteRenderer from "@/util/workflow/additional-modules/Renderer/RewriteRenderer";

// 流程图校验部分
import lintModule from "bpmn-js-bpmnlint";
import bpmnlint from "@/util/workflow/additional-modules/Lint/bpmnlint";

// 小地图
import minimapModule from "diagram-js-minimap";

import BpmnColorPickerModule from "bpmn-js-color-picker";

export default function (settings: Ref<EditorSettings>) {
  const modules: ModuleDeclaration[] = []; // modules 扩展模块数组
  let moddle: { [key: string]: any } = {}; // moddle 声明文件对象
  const options: { [key: string]: any } = {}; // modeler 其他配置

  // 配置 palette (可覆盖 paletteProvider 取消原生侧边栏)
  settings.value.paletteMode === "enhancement" &&
    modules.push(EnhancementPalette);
  settings.value.paletteMode === "rewrite" && modules.push(RewritePalette);
  settings.value.paletteMode === "custom" &&
    modules.push({ paletteProvider: ["type", function () {}] });

  // 配置 contextPad (可覆盖 contextPadProvider 取消原生上下文菜单)
  settings.value.contextPadMode === "enhancement" &&
    modules.push(EnhancementContextPad);
  settings.value.contextPadMode === "rewrite" &&
    modules.push(RewriteContextPad);

  // 配置 自定义渲染
  settings.value.rendererMode === "enhancement" &&
    modules.push(EnhancementRenderer);
  if (settings.value.rendererMode === "rewrite") {
    modules.push(RewriteRenderer);
    options["bpmnRenderer"] = { ...toRaw(settings.value).customTheme };
  }

  // 配置模板选择弹窗（会影响默认 popupmenu）
  if (settings.value.templateChooser || settings.value.penalMode !== "custom") {
    modules.push(
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
      CamundaPlatformPropertiesProviderModule,
      CamundaExtensionModule
    );
    moddle = {};
    if (settings.value.penalMode !== "custom") {
      options["propertiesPanel"] = { parent: "#camunda-penal" };
      moddle["camunda"] = camundaModdleDescriptors;
    }
    // if (settings.value.templateChooser) {
    //   modules.push(
    //     CloudElementTemplatesPropertiesProviderModule,
    //     ElementTemplateChooserModule,
    //     ConnectorsExtensionModule
    //   )
    //   options['exporter'] = {
    //     name: 'element-template-chooser',
    //     version: '0.0.1'
    //   }
    //   options['connectorsExtension'] = {
    //     appendAnything: true
    //   }
    // }
  }

  // 设置 lint 校验
  if (settings.value.useLint) {
    modules.push(lintModule);
    options["linting"] = {
      active: true,
      bpmnlint: bpmnlint,
    };
  }

  // 设置 lint 校验
  if (settings.value.miniMap) {
    modules.push(minimapModule);
    options["minimap"] = {
      open: true,
    };
  }

  // 官方网点背景
  if (settings.value.bg === "grid") {
    modules.push(Grid);
  }

  // 设置其他模块的启用
  if (settings.value.otherModule) {
    // 设置 自定义规则
    modules.push(Rules);

    modules.push(AutoPlace);

    modules.push(TokenSimulationModule);

    modules.push(BpmnColorPickerModule);

    // 设置键盘事件绑定
    options["keyboard"] = {
      bindTo: document,
    };

    modules.push(ElementFactory);
    options["elementFactory"] = {
      "bpmn:Task": { width: 120, height: 120 },
      "bpmn:SequenceFlow": { width: 100, height: 80 },
    };
  }

  // 配置 翻译 与 流程模拟
  modules.push(translate);

  // 设置对应的 moddle 解析配置文件 ( 避免上面已经配置了 camunda )
  if (!Object.keys(moddle).length) {
    if (settings.value.processEngine === "activiti")
      moddle["activiti"] = activitiModdleDescriptors;
    if (settings.value.processEngine === "camunda")
      moddle["camunda"] = camundaModdleDescriptors;
    if (settings.value.processEngine === "flowable")
      moddle["flowable"] = flowableModdleDescriptors;
  }

  // 设置自定义属性
  moddle["miyue"] = MiyueModdleDescriptors;

  return [modules, moddle, options];
}
