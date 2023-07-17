/**
 * 流程实例
 * @author ZnPi
 * @date 2023-04-01
 */
import type { AxiosPromise } from "axios";

import request from "@/util/axios";

import type { Page } from "@/model";
import type {
  ProcessInstance,
  ProcessInstanceDetail,
  MyProcessQuery,
  StartProcessInstanceForm
} from "@/model/process/process-center/process-instance";

const BASE_URL = "/workflow/process-instance";

/**
 * 获取我的流程
 */
function getMyProcesses(
  query: MyProcessQuery
): AxiosPromise<Page<ProcessInstance>> {
  return request.get(`${BASE_URL}/myProcesses`, { params: query });
}

/**
 * 启动流程实例
 */
function startProcessInstance(
  startProcessInstance: StartProcessInstanceForm
): AxiosPromise<string | null> {
  console.log(startProcessInstance)
  return request.post(
    `${BASE_URL}`,
    startProcessInstance
  );
}

/**
 * 获取流程实例详情
 */
function getProcessInstanceDetail(
  processInstanceId: string
): AxiosPromise<ProcessInstanceDetail> {
  return request.get(`${BASE_URL}/detail/${processInstanceId}`);
}

/**
 * 删除流程实例
 */
function deleteProcessInstance(
  processInstanceId: string
): AxiosPromise<string | null> {
  return request.delete(`${BASE_URL}/delete/${processInstanceId}`);
}

/**
 * 取消流程实例
 */
function cancelProcessInstance(
  processInstanceId: string
): AxiosPromise<string | null> {
  return request.delete(`${BASE_URL}/cancel/${processInstanceId}`);
}

export {
  getMyProcesses,
  startProcessInstance,
  getProcessInstanceDetail,
  deleteProcessInstance,
  cancelProcessInstance,
};
