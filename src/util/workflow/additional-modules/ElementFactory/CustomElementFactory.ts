import ElementFactory from "bpmn-js/lib/features/modeling/ElementFactory";
import type BpmnFactory from "bpmn-js/lib/features/modeling/BpmnFactory";
import type BpmnModdle from "bpmn-moddle";
import type { Translate } from "diagram-js/lib/i18n/translate";
import type { Dimensions } from "diagram-js/lib/core/Canvas";
import { getBusinessObject, getDi, is } from "bpmn-js/lib/util/ModelUtil";

type ElementConfig = Record<string, Dimensions>;

class CustomElementFactory extends ElementFactory {
  _config: ElementConfig | undefined;
  constructor(
    config: Record<string, Dimensions>,
    bpmnFactory: BpmnFactory,
    moddle: BpmnModdle,
    translate: Translate
  ) {
    super(bpmnFactory, moddle, translate);
    this._config = config;
  }

  getDefaultSize(element: any, di: any) {
    const bo = getBusinessObject(element);
    const types: string[] = Object.keys(this._config || {});
    for (const type of types) {
      if (is(bo, type)) {
        return this._config![type];
      }
    }
    return super.getDefaultSize(element, di);
  }
}

// @ts-ignore
CustomElementFactory.$inject = [
  "config.elementFactory",
  "bpmnFactory",
  "moddle",
  "translate",
];
// @ts-ignore
ElementFactory.$inject = ["bpmnFactory", "moddle", "translate"];

export default CustomElementFactory;
