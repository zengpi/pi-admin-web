import type { ProcessDefinitionForm } from "@/model/process/process-management/process-form";
import { PageQuery } from "../..";

class ProcessInstance {
  /**
   * 流程实例 ID
   */
  id?: string;
  /**
   * 提交时间
   */
  startTime?: string;

  /**
   * 完成时间
   */
  endTime?: string;
  /**
   * 流程定义 ID
   */
  processDefinitionId?: string;
  /**
   * 流程定义名称
   */
  processDefinitionName?: string;
  /**
   * 流程定义类别
   */
  processCategory?: string;
  /**
   * 流程定义版本
   */
  processDefinitionVersion?: string;
  /**
   * 当前节点
   */
  currentNode?: string;
  /**
   * 耗时
   */
  duration?: string;
}

class StartProcessInstanceForm {
  /**
     * 流程实例 id
     */
  processDefinitionId?: string;

  /**
   * 名称
   */
  processDefinitionName?: string;

  /**
   * 流程变量
   */
  variables?: any;

  /**
   * 是否内置表单（0:=否；1:是）
   */
  isBuiltInForm?: number;

  outcome?: string;
}

class MyProcess {
  /**
   * 流程实例 ID
   */
  id?: string;
  /**
   * 任务 ID
   */
  taskId?: string;
  /**
   * 提交时间
   */
  startTime?: string;

  /**
   * 完成时间
   */
  endTime?: string;
  /**
   * 流程定义 ID
   */
  processDefinitionId?: string;
  /**
   * 流程定义名称
   */
  processDefinitionName?: string;
  /**
   * 流程定义类别
   */
  processCategory?: string;
  /**
   * 流程定义版本
   */
  processDefinitionVersion?: string;
  /**
   * 当前节点
   */
  currentNode?: string;
  /**
   * 耗时
   */
  duration?: string;
}

class ProcessInstanceQuery {
  /**
   * 时间
   */
  startTime?: string[];
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
   * 页码
   */
  pageNum = 1;
  /**
   * 每页记录数
   */
  pageSize = 10;
}

class MyProcessQuery extends PageQuery {
  /**
   * 创建时间
   */
  startTime?: string[];
  /**
   * 流程标识
   */
  key?: string;
  /**
   * 流程名称
   */
  name?: string;
  /**
   * 流程分类
   */
  category?: string;
}

class Comment {
  /**
   * 类型
   */
  type?: string;
  /**
   * 时间
   */
  time?: string;
  /**
   * 评论
   */
  fullMessage?: string;
}

class ProcessInstanceLog {
  /**
   * 提交时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 活动 ID
   */
  activityId?: string;
  /**
   * 活动名称
   */
  activityName?: string;
  /**
   * 活动类型
   */
  activityType?: string;
  /**
   * 活动耗时
   */
  duration?: string;
  /**
   * 审批人名称
   */
  assigneeName?: string;
  /**
   * 候选审批人
   */
  candidate?: string;
  /**
   * 意见
   */
  comments?: Comment[];
}

class ViewerElement {
  /**
   * 已完成任务节点
   */
  finishedTasks?: string[];
  /**
   * 已完成序列流
   */
  finishedSequenceFlows?: string[];
  /**
   * 待完成任务节点
   */
  todoTasks?: string[];
  /**
   * 已拒绝任务节点
   */
  rejectedTasks?: string[];
}

class ProcessInstanceDetail {
  /**
   * 表单
   */
  forms: ProcessDefinitionForm[] = [];
  /**
   * 日志
   */
  logs: ProcessInstanceLog[] = [];
  /**
   * BPMN XML
   */
  bpmnXml: string = "";
  /**
   * 查看器元素
   */
  viewerElement!: ViewerElement;
}

export {
  ProcessInstance,
  StartProcessInstanceForm,
  MyProcess,
  ProcessInstanceQuery,
  MyProcessQuery,
  /**
   * 流程实例日志
   */
  ProcessInstanceLog,
  /**
   * 流程查看器元素
   */
  ViewerElement,
  /**
   * 流程实例详情
   */
  ProcessInstanceDetail,
};
