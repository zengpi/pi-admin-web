import type { AxiosPromise } from "axios";

import request from "@/util/axios";

import type { BaseQuery, Page } from "@/model";
import type {
  Role,
  RoleMemberQuery,
  RoleMember,
  RoleUserAllocation,
} from "@/model/system/role";

const BASE_URL = "/role";

/**
 * 获取角色
 * @param query 查询参数
 * @returns 角色
 */
function getRoles(query: BaseQuery): AxiosPromise<Page<Role>> {
  return request.get(BASE_URL, { params: query });
}

/**
 * 新增或编辑角色
 * @param role 角色
 * @param isEdit 是否编辑
 */
function saveOrUpdate(role: Role, isEdit: boolean): AxiosPromise<null> {
  return request({
    url: BASE_URL,
    method: isEdit ? "put" : "post",
    data: role,
  });
}

/**
 * 角色删除
 *
 * @param ids 待删除 ID
 */
function deleteRole(ids: number[]): AxiosPromise<null> {
  return request.delete(`${BASE_URL}/${ids}`);
}

/**
 * 获取所有角色
 *
 * @return 角色
 */
function getAllRoles(): AxiosPromise<Array<Role>> {
  return request.get(`${BASE_URL}/allRoles`);
}

/**
 * 角色成员
 *
 * @param query 查询参数
 * @return 角色成员
 */
function getRoleMembers(
  query: RoleMemberQuery
): AxiosPromise<Page<RoleMember>> {
  return request.get(`${BASE_URL}/roleMembers`, { params: query });
}

/**
 * 为角色分配用户
 *
 * @param dto RoleUserAllocationDTO
 */
function allocateRoleUser(dto: RoleUserAllocation): AxiosPromise<null> {
  return request.post(`${BASE_URL}/roleUserAllocation`, dto);
}

/**
 * 为角色分配菜单
 * @param roleId 角色 ID
 * @param menuIds 菜单 ID 列表
 * @returns
 */
function allocateRoleMenu(
  roleId?: number,
  menuIds?: number[]
): AxiosPromise<null> {
  return request.post(`${BASE_URL}/roleMenuAllocation/${roleId}`, menuIds);
}

/**
 * 根据角色 ID 获取数据权限部门 ID 列表
 * @param roleId 角色 ID
 * @returns 部门 ID 列表
 */
function getDataPermissionDeptIdsByRoleId(
  roleId: number
): AxiosPromise<number[]> {
  return request.get(`${BASE_URL}/dataPermissionDeptIds/${roleId}`);
}

/**
 * 根据角色 ID 获取菜单 ID 列表
 *
 * @param roleId 角色 ID
 * @returns 菜单 ID 列表
 */
function getMenuIdsByRoleId(roleId?: number): AxiosPromise<Array<number>> {
  return request(`${BASE_URL}/menuIds/${roleId}`);
}

export {
  getRoles,
  saveOrUpdate,
  deleteRole,
  getAllRoles,
  getRoleMembers,
  allocateRoleUser,
  allocateRoleMenu,
  getDataPermissionDeptIdsByRoleId,
  getMenuIdsByRoleId,
};
