import type { Base } from "diagram-js/lib/model";
import { is } from "bpmn-js/lib/util/ModelUtil";

import modelerStore from "@/stores/workflow/modeler";

// 是否可以设置表单
function isForm(element: Base): boolean {
  return is(element, "bpmn:UserTask") || is(element, "bpmn:StartEvent");
}

function getFormValue(element: Base): string {
  return element?.businessObject.formKey;
}

function setFormValue(element: Base, value: string | undefined) {
  const store = modelerStore();
  const modeling = store.getModeling;

  modeling.updateProperties(element, {
    formKey: value,
  });
}

export { getFormValue, setFormValue, isForm };
