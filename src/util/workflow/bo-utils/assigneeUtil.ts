import type { Base } from "diagram-js/lib/model";
import { is } from "bpmn-js/lib/util/ModelUtil";

import modelerStore from "@/stores/workflow/modeler";

class AssigneeForm {
  assigneeType: string | undefined = undefined;
  assigneeNames?: string;
  candidateUsers?: string;
  candidateGroups?: string;
  assignee?: string;
}

/**
 * 是否设置审批人
 */
function isAssignee(element: Base): boolean {
  return is(element, "bpmn:UserTask");
}

function getAssigneeUserValue(element: Base): AssigneeForm {
  return {
    assigneeType: element?.businessObject.assigneeType,
    assigneeNames: element?.businessObject.assigneeNames,
    candidateUsers: element?.businessObject.candidateUsers,
    candidateGroups: element?.businessObject.candidateGroups,
    assignee: element?.businessObject.assignee,
  };
}

function setAssigneeUserValue(element: Base, value: AssigneeForm | undefined) {
  const store = modelerStore();
  const modeling = store.getModeling;

  modeling.updateProperties(element, value);
}

export { isAssignee, getAssigneeUserValue, setAssigneeUserValue, AssigneeForm };
