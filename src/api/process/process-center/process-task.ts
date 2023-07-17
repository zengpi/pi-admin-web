import type { AxiosPromise } from "axios";

import request from "@/util/axios";

import qs from "qs";

import type { Page } from "@/model";
import type {
  TodoTask,
  TaskQuery,
  ApproveTask,
  ApproveCommon,
  ApproveReject,
  DoneTask,
  Copy,
} from "@/model/process/process-center/process-task";
import type { ProcessDefinitionForm } from "@/model/process/process-management/process-form";

const BASE_URL = "/workflow/task";

/**
 * 获取待办任务
 */
function getTodoTask(query: TaskQuery): AxiosPromise<Page<TodoTask>> {
  return request.get(
    `${BASE_URL}/todoTask?${qs.stringify(query, { indices: false })}`
  );
}

/**
 * 获取任务表单
 *
 * @param taskId 任务 ID
 * @return 任务表单
 */
function getTaskForm(taskId: string): AxiosPromise<ProcessDefinitionForm> {
  return request.get(`${BASE_URL}/form/${taskId}`);
}

/**
 * 审批通过
 */
function approve(approveTask: ApproveTask): AxiosPromise<null | string> {
  return request.post(`${BASE_URL}/approve`, approveTask);
}

/**
 * 委派
 */
function delegate(delegateTask: ApproveCommon): AxiosPromise<null | string> {
  return request.post(`${BASE_URL}/delegate`, delegateTask);
}

/**
 * 转办
 */
function transfer(transferTask: ApproveCommon): AxiosPromise<null | string> {
  return request.post(`${BASE_URL}/transfer`, transferTask);
}

/**
 * 驳回
 */
function reject(approveReject: ApproveReject): AxiosPromise<null | string> {
  return request.post(`${BASE_URL}/reject`, approveReject);
}

/**
 * 获取已办任务
 */
function getDoneTask(query: TaskQuery): AxiosPromise<Page<DoneTask>> {
  return request.get(
    `${BASE_URL}/doneTask?${qs.stringify(query, { indices: false })}`
  );
}

/**
 * 撤回已办任务
 */
function revoke(
  taskId: string,
  processInstanceId: string
): AxiosPromise<null | string> {
  return request.post(`${BASE_URL}/revoke`, null, {
    params: { taskId, processInstanceId },
  });
}

/**
 * 获取抄送列表
 */
function getCopies(taskQuery: TaskQuery): AxiosPromise<Page<Copy>> {
  return request.get(`${BASE_URL}/copies`, { params: taskQuery });
}

export {
  getTodoTask,
  getTaskForm,
  approve,
  delegate,
  transfer,
  reject,
  getDoneTask,
  revoke,
  getCopies,
};
