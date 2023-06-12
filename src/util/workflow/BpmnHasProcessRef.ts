import { is } from "bpmn-js/lib/util/ModelUtil";
import type { Base } from "diagram-js/lib/model";

function hasProcessRef(element: Base): boolean {
  return (
    (is(element, "bpmn:Participant") &&
      element.businessObject.get("processRef")) ||
    is(element, "bpmn:Process")
  );
}
