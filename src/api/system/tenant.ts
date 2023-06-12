import request from "@/util/axios";

import type { AxiosPromise } from "axios";

import type { BaseQuery, Page } from "@/model";
import type { LoginTenant, Tenant } from "@/model/system/tenant";

const BASE_URL = "/tenant";

/**
 * 获取租户
 * @param query 查询条件
 * @return 租户列表
 */
function getTenants(query: BaseQuery): AxiosPromise<Page<Tenant>> {
  return request(BASE_URL, { params: query });
}

/**
 * 新增或编辑
 * @param tenant 租户
 * @param isEdit 是否编辑
 */
function saveOrUpdate(tenant: Tenant, isEdit: boolean): AxiosPromise<any> {
  return request({
    url: BASE_URL,
    method: isEdit ? "put" : "post",
    data: tenant,
  });
}

/**
 * 删除套餐
 * @param ids 待删除记录的 ID 列表
 */
function deleteTenants(ids: number[]): AxiosPromise<string | null> {
  return request.delete(`${BASE_URL}/${ids}`);
}

/**
 * 根据租户账号获取租户信息
 *
 * @param usernmae 租户账号
 * @return 租户信息，当 usernmae 为 null 时返回所有
 */
function getTenantsByUsername(usernmae?: string): AxiosPromise<LoginTenant[]> {
  return request.get(`${BASE_URL}/login/tenants`, {
    params: { username: usernmae },
  });
}

export { getTenants, saveOrUpdate, getTenantsByUsername, deleteTenants };
