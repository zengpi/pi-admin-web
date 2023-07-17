/**
 * 流程定义
 * @author ZnPi
 * @date 2023-04-01
 */
import type { AxiosPromise } from "axios";

import request from "@/util/axios";

import type { Page } from "@/model";
import type {
  BootableDefinitionQuery,
  ProcessDefinition,
  ProcessDefinitionQuery,
} from "@/model/process/process-management/process-definition";
import type { ProcessDefinitionForm } from "@/model/process/process-management/process-form";

const BASE_URL = "/workflow/process-definitions";

/**
 * 获取流程定义
 */
function getProcessDefinition(
  processDefinitionQuery: ProcessDefinitionQuery
): AxiosPromise<Page<ProcessDefinition>> {
  return request.get(`${BASE_URL}`, { params: processDefinitionQuery });
}

/**
 * 获取可启动的流程定义
 */
function getBootableDefinition(
  processDefinitionQuery: BootableDefinitionQuery
): AxiosPromise<Page<ProcessDefinition>> {
  return request.get(`${BASE_URL}`, { params: processDefinitionQuery });
}

/**
 * 获取流程定义表单
 */
function getProcessDefinitionStartForm(
  processDefinitionId: string
): AxiosPromise<ProcessDefinitionForm> {
  return request.get(`${BASE_URL}/${processDefinitionId}/start-form`);
}

/**
 * 根据流程定义 ID 获取 BPMN Xml 文件
 * @returns BPMN Xml 文件内容
 */
function getBpmnXml(definitionId: string): AxiosPromise<string> {
  return request.get(`${BASE_URL}/bpmnXml/${definitionId}`);
}

/**
 * 更改状态
 * @param definitionId 流程定义 ID
 * @param suspended 状态（true: 挂起，false: 激活）
 */
function changeState(
  definitionId: string,
  suspended: boolean
): AxiosPromise<string | null> {
  return request.patch(`${BASE_URL}/state/${definitionId}/${suspended}`);
}

/**
 * 获取流程部署历史版本
 * @param query 查询参数
 * @returns 程部署历史版本
 */
function getHistoryProcessDefinitions(
  query: ProcessDefinitionQuery
): AxiosPromise<Page<ProcessDefinition>> {
  return request.get(`${BASE_URL}/history`, { params: query });
}

export {
  getProcessDefinition,
  getBootableDefinition,
  getBpmnXml,
  // 更改状态
  changeState,
  // 获取流程部署历史版本
  getHistoryProcessDefinitions,
  getProcessDefinitionStartForm
};
