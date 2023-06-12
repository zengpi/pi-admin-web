import { BaseDialog, PageQuery } from "..";

class ProcessDefinition {
  /**
   * 唯一标识
   */
  id?: string;
  /**
   * 流程名称
   */
  name?: string;
  /**
   * 流程定义的所有版本的唯一名称
   */
  key?: string;
  /**
   * 类别，派生自定义元素中的 targetNamespace 属性
   */
  category?: string;
  /**
   * 流程定义的版本
   */
  version?: number;
  /**
   * 如果流程定义处于挂起状态，则返回 true。
   */
  suspended?: boolean;
}

class ProcessDefinitionQuery extends PageQuery {
  /**
   * 流程标识
   */
  key = "";
  /**
   * 流程名称
   */
  name = "";
  /**
   * 流程分类
   */
  category = "";
  /**
   * 状态
   */
  suspended?: boolean;
  /**
   * 是否最新版本
   */
  latestVersion?: boolean;
  /**
   * 流程部署 ID
   */
  deploymentId = "";

  constructor(suspended?: boolean) {
    super();
    this.suspended = suspended;
  }
}

class BootableDefinitionQuery extends PageQuery {
  /**
   * 流程标识
   */
  key = "";
  /**
   * 流程名称
   */
  name = "";
  /**
   * 流程分类
   */
  category = "";
}

class ProcessDefinitionDialog extends BaseDialog {
  processId?: string;
  processKey?: string;
}

class StartProcessDialog extends BaseDialog {
  processDefinitionId!: string;
}

export {
  ProcessDefinition,
  ProcessDefinitionQuery,
  BootableDefinitionQuery,
  ProcessDefinitionDialog,
  StartProcessDialog,
};
