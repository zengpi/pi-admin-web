import { PageQuery } from "../..";

/**
 * 代办任务
 */
class TodoTask {
  /**
   * 任务 ID
   */
  id?: string;
  /**
   * 任务名称
   */
  name?: string;
  taskDefinitionKey?: string;
  /**
   * 发起时间
   */
  createTime?: string;
  /**
   * 流程实例 ID
   */
  processInstanceId?: string;
  /**
   * 流程定义 ID
   */
  processDefinitionId?: string;
  /**
   * 流程定义名称
   */
  processDefinitionName?: string;
  /**
   * 流程定义版本
   */
  processDefinitionVersion?: number;
  /**
   * 流程部署 ID
   */
  deploymentId?: string;
  /**
   * 发起人
   */
  startUsername?: string;
  /**
   * 发起人姓名
   */
  startName?: string;
  /**
   * 流程变量
   */
  processVars?: Map<String, Object>;
}

class ApproveTask {
  /**
   * 任务 ID
   */
  taskId?: string;
  /**
   * 流程实例 ID
   */
  processInstanceId?: string;
  /**
     * 表单 id
     */
  formId?: string;
  /**
   * 审批意见
   */
  comment?: string;
  outcome?: string;
  /**
   * 流程变量
   */
  variables?: any;
  /**
   * 抄送人
   */
  copyUsers?: string[];
  /**
   * 下一级审批人
   */
  nextUsers?: string[];
}

class TaskQuery extends PageQuery {
  /**
   * 流程名称
   */
  processDefinitionName?: string;
  /**
   * 日期范围
   */
  dateRange?: string[];
}

class ApproveCommon {
  /**
   * 任务ID
   */
  taskId!: string;
  /**
   * 流程实例 ID
   */
  processInstanceId!: string;
  /**
   * 委派人
   */
  userName!: string;
  /**
   * 审批意见
   */
  comment?: string;
  /**
   * 抄送人
   */
  copyUsers?: string[];
}

class ApproveReject {
  /**
   * 任务ID
   */
  taskId!: string;
  /**
   * 流程实例 ID
   */
  processInstanceId!: string;
  /**
   * 审批意见
   */
  comment?: string;
  /**
   * 抄送人
   */
  copyUsers?: string[];
}

class DoneTask {
  /**
   * 任务 ID
   */
  id?: string;
  /**
   * 任务名称
   */
  name?: string;
  /**
   * 发起时间
   */
  createTime?: string;
  /**
   * 审批时间
   */
  endTime?: string;
  /**
   * 耗时
   */
  duration?: string;
  /**
   * 流程实例 ID
   */
  processInstanceId?: string;
  /**
   * 流程定义名称
   */
  processDefinitionName;
  /**
   * 发起人
   */
  startUsername?: string;
  /**
   * 发起人姓名
   */
  startName?: string;
}

class Copy {
  /**
   * 主键
   */
  id?: number;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 创建人
   */
  createBy?: string;

  /**
   * 名称
   */
  name?: string;
  /**
   * 流程定义主键
   */
  processDefinitionId?: string;
  /**
   * 流程定义名称
   */
  processDefinitionName?: string;
  /**
   * 流程实例主键
   */
  processInstanceId?: string;
}

export {
  TodoTask,
  ApproveTask,
  TaskQuery,
  ApproveCommon,
  ApproveReject,
  DoneTask,
  Copy,
};
