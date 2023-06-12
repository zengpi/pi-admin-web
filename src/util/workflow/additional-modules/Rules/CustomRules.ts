import RuleProvider from "diagram-js/lib/features/rules/RuleProvider";
import type { Base } from "diagram-js/lib/model";

class CustomRules extends RuleProvider {
  constructor(eventBus: any) {
    super(eventBus);
    this.init();
  }

  init() {
    // 禁止删除开始和结束
    this.addRule(["elements.delete"], 2000, function (context: any) {
      const [element]: Base[] = context.elements;
      return (
        element.type !== "bpmn:StartEvent" && element.type !== "bpmn:EndEvent"
      );
    });
  }
}

// @ts-ignore
CustomRules.$inject = ["eventBus"];

export default CustomRules;
