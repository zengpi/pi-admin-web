/**
 * 流程模型
 * @author ZnPi
 * @date 2023-04-05
 */
import type { AxiosPromise } from "axios";

import request from "@/util/axios";

import type { Page } from "@/model";
import type {
  ProcessModel,
  ProcessModelQuery,
  SaveModelDesign,
} from "@/model/process/process-management/process-model";

const BASE_URL = "/workflow/model";

/**
 * 获取流程模型
 * @param query 查询参数
 * @returns 流程模型
 */
function getModels(query: ProcessModelQuery): AxiosPromise<Page<ProcessModel>> {
  return request.get(BASE_URL, { params: query });
}

/**
 * 新增模型
 *
 * @param model 模型表单
 */
function saveModel(model: ProcessModel): AxiosPromise<null | string> {
  return request.post(BASE_URL, model);
}

/**
 * 更新流程模型
 *
 * @param model 模型表单
 */
function updateModel(model: ProcessModel): AxiosPromise<null | string> {
  return request.put(BASE_URL, model);
}

/**
 * 删除流程模型
 *
 * @param ids 待删除 ID
 */
function deleteModels(ids: string[]): AxiosPromise<null | string> {
  return request.delete(`${BASE_URL}/${ids}`);
}

/**
 * 根据模型 ID 获取 Bpmn xml
 * @param modelId 模型 ID
 * @returns Bpmn xml
 */
function getBpmnXml(modelId: string | null): AxiosPromise<string> {
  return request.get(`${BASE_URL}/bpmnXml/${modelId}`);
}

/**
 * 保存流程模型设计
 */
function saveModelDesign(model: SaveModelDesign): AxiosPromise<null | string> {
  return request.post(`${BASE_URL}/modelDesign`, model);
}

/**
 * 部署流程模型
 * @param modelId 模型 ID
 */
function deployModel(modelId: string | null): AxiosPromise<void> {
  return request.post(`${BASE_URL}/deploy/${modelId}`);
}

export {
  getModels,
  saveModel,
  updateModel,
  deleteModels,
  saveModelDesign,
  getBpmnXml,
  deployModel,
};
