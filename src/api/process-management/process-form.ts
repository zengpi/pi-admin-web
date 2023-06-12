/**
 * 表单
 * @author ZnPi
 * @date 2023-04-02
 */
import type { AxiosPromise } from "axios";

import request from "@/util/axios";

import type { BaseQuery, Page } from "@/model";
import type { ProcessDefinitionForm } from "@/model/process-management/process-form";

const BASE_URL = "/workflow/form";

/**
 * 获取表单列表
 * @param query 查询参数
 * @returns 表单列表
 */
function getForms(query: BaseQuery): AxiosPromise<Page<ProcessDefinitionForm>> {
  return request.get(BASE_URL, { params: query });
}

/**
 * 获取指定表单
 * @param formId 表单 id
 * @returns 表单
 */
function getForm(formId: string): AxiosPromise<ProcessDefinitionForm> {
  return request.get(`${BASE_URL}/${formId}`);
}

/**
 * 新增或编辑表单
 * @param form 表单
 * @param isEdit 是否编辑
 */
function saveOrUpdate(
  form: ProcessDefinitionForm,
  isEdit: boolean
): AxiosPromise<string | null> {
  return request({
    url: BASE_URL,
    method: isEdit ? "put" : "post",
    data: form,
  });
}

/**
 * 删除表单
 * @param ids 待删除记录的 ID 列表
 */
function deleteForms(ids: number[]): AxiosPromise<any> {
  return request.delete(`${BASE_URL}/${ids}`);
}

/**
 * 获取所有表单
 * @returns 所有表单
 */
function getAllForms(): AxiosPromise<Array<ProcessDefinitionForm>> {
  return request.get(`${BASE_URL}/allForms`);
}

export { getForms, getForm, deleteForms, saveOrUpdate, getAllForms };
