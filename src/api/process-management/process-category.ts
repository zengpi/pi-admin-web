/**
 * 流程分类
 * @author ZnPi
 * @date 2023-04-01
 */
import type { AxiosPromise } from "axios";

import request from "@/util/axios";

import type { BaseQuery, Page } from "@/model";
import type { ProcessCategory } from "@/model/process-management/process-category";

const BASE_URL = "/workflow/category";

/**
 * 获取分类
 */
function getCategories(query: BaseQuery): AxiosPromise<Page<ProcessCategory>> {
  return request.get(`${BASE_URL}`, { params: query });
}

/**
 * 新增或编辑分类
 * @param processCategory 分类
 * @param isEdit 是否编辑
 */
function saveOrUpdate(
  processCategory: ProcessCategory,
  isEdit: boolean
): AxiosPromise<string | null> {
  return request({
    url: BASE_URL,
    method: isEdit ? "put" : "post",
    data: processCategory,
  });
}

/**
 * 删除分类
 * @param ids 待删除记录的 ID 列表
 */
function deleteCategories(ids: number[]): AxiosPromise<string | null> {
  return request.delete(`${BASE_URL}/${ids}`);
}

export { getCategories, saveOrUpdate, deleteCategories };
