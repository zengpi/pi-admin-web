import { ElMessage } from "element-plus";
import type { Base } from "diagram-js/lib/model";
import modelerStore from "@/stores/workflow/modeler";
import { isIdValid } from "@/util/workflow/BpmnValidator";

export function getIdValue(element: Base): string {
  return element.businessObject.id;
}

export function setIdValue(element: Base, value: string) {
  const errorMsg = isIdValid(element.businessObject, value);

  if (errorMsg && errorMsg.length) {
    return ElMessage.warning(errorMsg);
  }

  const store = modelerStore();
  const modeling = store.getModeling;

  modeling.updateProperties(element, {
    id: value,
  });
}
