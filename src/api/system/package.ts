import request from "@/util/axios";

import type { BaseQuery, Page } from "@/model";
import type { Package } from "@/model/system/package";

import type { AxiosPromise } from "axios";

const BASE_URL = "/package";

/**
 * 获取套餐
 * @param query 查询条件
 * @return 套餐列表
 */
function getPackages(query: BaseQuery): AxiosPromise<Page<Package>> {
  return request(BASE_URL, { params: query });
}

/**
 * 新增或编辑
 * @param packageV 套餐
 * @param isEdit 是否编辑
 */
function saveOrUpdate(packageV: Package, isEdit: boolean): AxiosPromise<any> {
  return request({
    url: BASE_URL,
    method: isEdit ? "put" : "post",
    data: packageV,
  });
}

/**
 * 删除套餐
 * @param ids 待删除记录的 ID 列表
 */
function deletePackages(ids: number[]): AxiosPromise<string | null> {
  return request.delete(`${BASE_URL}/${ids}`);
}

/**
 * 根据套餐 ID 获取菜单 ID 列表
 *
 * @param packageId 套餐 ID
 * @returns 菜单 ID 列表
 */
function getMenuIdsByPackageId(
  packageId?: number
): AxiosPromise<Array<number>> {
  return request(`${BASE_URL}/menuIds/${packageId}`);
}

/**
 * 为套餐分配菜单
 * @param packageId 套餐
 * @param menuIds 菜单列表
 * @returns
 */
function allocatePackageMenu(
  packageId?: number,
  menuIds?: number[]
): AxiosPromise<any> {
  return request.post(`${BASE_URL}/packageMenusAllocate/${packageId}`, menuIds);
}

export {
  getPackages,
  saveOrUpdate,
  deletePackages,
  getMenuIdsByPackageId,
  allocatePackageMenu,
};
