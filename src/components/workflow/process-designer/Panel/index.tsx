import { defineComponent, type Component, markRaw, onMounted, ref } from "vue";

import { ElCollapse } from "element-plus";

import debounce from "lodash.debounce";

import type { Base, Connection, Label, Shape } from "diagram-js/lib/model";
import type { Translate } from "diagram-js/lib/i18n/translate";

import modelerStore from "@/stores/workflow/modeler";

import EventEmitter from "@/util/workflow/EventEmitter";
import Logger from "@/util/workflow/Logger";
import { isAsynchronous } from "@/util/workflow/bo-utils/asynchronousContinuationsUtil";
import { isExecutable } from "@/util/workflow/bo-utils/executionListenersUtil";
import { isJobExecutable } from "@/util/workflow/bo-utils/jobExecutionUtil";
import { isStartInitializable } from "@/util/workflow/bo-utils/initiatorUtil";
import { isCanbeConditional } from "@/util/workflow/bo-utils/conditionUtil";
import { isForm } from "@/util/workflow/bo-utils/formUtil";
import { isAssignee } from "@/util/workflow/bo-utils/assigneeUtil";
import { customTranslate } from "@/util/workflow/additional-modules/Translate";

import getBpmnIconType from "@/assets/icons/bpmn-icons/getIconType";
import bpmnIcons from "@/assets/icons/bpmn-icons";

import BpmnIcon from "@/components/workflow/process-designer/common/BpmnIcon.vue";
import ElementGenerations from "./components/ElementGenerations.vue";
import ElementConditional from "./components/ElementConditional.vue";
import ElementDocumentations from "./components/ElementDocumentations.vue";
import ElementExecutionListeners from "./components/ElementExecutionListeners.vue";
import ElementExtensionProperties from "./components/ElementExtensionProperties.vue";
import ElementAsyncContinuations from "./components/ElementAsyncContinuations.vue";
import ElementJobExecution from "./components/ElementJobExecution.vue";
import ElementStartInitiator from "./components/ElementStartInitiator.vue";
import ElementForm from "./components/ElementForm.vue";
import ElementAssignee from "./components/ElementAssignee.vue";

const Panel = defineComponent({
  name: "Panel",
  setup() {
    const modeler = modelerStore();
    const panel = ref<HTMLDivElement | null>(null);
    const currentElementId = ref<string | undefined>(undefined);
    const currentElementType = ref<string | undefined>(undefined);

    const penalTitle = ref<string | undefined>("属性配置");
    const bpmnIconName = ref<string>("Process");
    const bpmnElementName = ref<string>("Process");

    const renderComponents = markRaw<Component[]>([]);

    const setCurrentComponents = (element: Base) => {
      // 清空
      renderComponents.splice(0, renderComponents.length);
      renderComponents.push(ElementGenerations);
      renderComponents.push(ElementDocumentations);
      isForm(element) && renderComponents.push(ElementForm);
      isAssignee(element) && renderComponents.push(ElementAssignee);
      isCanbeConditional(element) && renderComponents.push(ElementConditional);
      isJobExecutable(element) && renderComponents.push(ElementJobExecution);
      renderComponents.push(ElementExtensionProperties);
      isExecutable(element) && renderComponents.push(ElementExecutionListeners);
      isAsynchronous(element) &&
        renderComponents.push(ElementAsyncContinuations);
      isStartInitializable(element) &&
        renderComponents.push(ElementStartInitiator);
    };

    // 设置选中元素，更新 store
    const setCurrentElement = debounce(
      (element: Shape | Base | Connection | Label | null) => {
        let activatedElement: BpmnElement | null | undefined = element;
        let activatedElementTypeName = "";

        if (!activatedElement) {
          activatedElement =
            modeler.getElRegistry?.find((el) => el.type === "bpmn:Process") ||
            modeler.getElRegistry?.find(
              (el) => el.type === "bpmn:Collaboration"
            );

          if (!activatedElement) {
            return Logger.prettyError("No Element found!");
          }
        }
        activatedElementTypeName = getBpmnIconType(activatedElement);

        modeler.setElement(markRaw(activatedElement), activatedElement.id);
        currentElementId.value = activatedElement.id;
        currentElementType.value = activatedElement.type.split(":")[1];

        penalTitle.value = modeler.getModeler?.get<Translate>("translate")(
          currentElementType.value
        );
        bpmnIconName.value = (bpmnIcons as any)[activatedElementTypeName];
        bpmnElementName.value = activatedElementTypeName;

        setCurrentComponents(activatedElement);
        EventEmitter.emit("element-update", activatedElement);

        Logger.prettyPrimary(
          "Selected element changed",
          `ID: ${activatedElement.id} , type: ${activatedElement.type}`
        );
        Logger.prettyInfo(
          "Selected element businessObject",
          activatedElement.businessObject
        );
      },
      100
    );

    EventEmitter.on("modeler-init", (modeler: any) => {
      // 导入完成后默认选中 process 节点
      modeler.on("import.done", () => {
        setCurrentElement(null);
      });
      // 监听选择事件，修改当前激活的元素以及表单
      modeler.on("selection.changed", ({ newSelection }: any) => {
        setCurrentElement(newSelection[0] || null);
      });
      modeler.on("element.changed", ({ element }: any) => {
        // 保证 修改 "默认流转路径" 等类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        if (element && element.id === currentElementId.value) {
          setCurrentElement(element);
        }
      });

      modeler.on("element.click", (event: any) => {
        Logger.prettyInfo("Element Click", event);
      });
    });

    onMounted(() => !currentElementId.value && setCurrentElement(null));

    return () => (
      <div ref={panel} class="panel">
        <div class="panel-header">
          <BpmnIcon name={bpmnIconName.value}></BpmnIcon>
          <p>{bpmnElementName.value}</p>
          <p>{customTranslate(currentElementType.value || "Process")}</p>
        </div>
        <ElCollapse arrow-placement="right">
          {renderComponents.map((component) => (
            <component is={component}></component>
          ))}
        </ElCollapse>
      </div>
    );
  },
});

export default Panel;
