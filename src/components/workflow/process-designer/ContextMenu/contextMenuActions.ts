import type BpmnReplace from "bpmn-js/lib/features/replace/BpmnReplace";
import type ElementFactory from "bpmn-js/lib/features/modeling/ElementFactory";
import type Create from "diagram-js/lib/features/create/Create";
import modeler from "@/stores/workflow/modeler";

export default function () {
  const modelerStore = modeler();
  let replaceElement: any;
  let elementFactory: any;
  let create: any;

  function replaceAction(target: any, currentElement: any) {
    if (!replaceElement) {
      replaceElement =
        modelerStore.getModeler!.get<BpmnReplace>("bpmnReplace").replaceElement;
    }
    replaceElement(currentElement, target);
  }

  function appendAction(target: any, event: any) {
    if (!elementFactory) {
      elementFactory =
        modelerStore.getModeler!.get<ElementFactory>("elementFactory");
    }
    if (!create) {
      create = modelerStore.getModeler!.get<Create>("create");
    }
    const shape = elementFactory.createShape(target);
    if (target.isExpanded != null) {
      shape.businessObject.di.isExpanded = target.isExpanded;
    }
    setTimeout(() => create.start(event, shape), 30);
  }

  return {
    replaceAction,
    appendAction,
  };
}
