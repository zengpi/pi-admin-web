import type { AxiosPromise } from "axios";

import request from "@/util/axios";

import type { Page, BaseQuery } from "@/model";
import type { Enterprise } from "@/model/system/enterprise";

const BASE_URL = "/enterprise";

/**
 * 查询企业
 * @param query 查询参数
 * @returns 企业列表
 */
function getEnterprises(query: BaseQuery): AxiosPromise<Page<Enterprise>> {
  return request.get(BASE_URL, { params: query });
}

/**
 * 新增或编辑
 * @param enterprise 企业
 * @param isEdit 是否编辑
 */
function saveOrUpdate(
  enterprise: Enterprise,
  isEdit: boolean
): AxiosPromise<any> {
  return request({
    url: BASE_URL,
    method: isEdit ? "put" : "post",
    data: enterprise,
  });
}

/**
 * 删除分类
 * @param ids 待删除记录的 ID 列表
 */
function deleteEnterprise(ids: number[]): AxiosPromise<string | null> {
  return request.delete(`${BASE_URL}/${ids}`);
}

export { getEnterprises, saveOrUpdate, deleteEnterprise };
