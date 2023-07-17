/**
 * 流程部署
 * @author ZnPi
 * @date 2023-04-02
 */
import type { AxiosPromise } from "axios";

import request from "@/util/axios";

import type { BaseQuery, Page } from "@/model";
import type { ProcessDeployment } from "@/model/process/process-management/process-deployment";

const BASE_URL = "/workflow/deployment";

/**
 * 获取流程部署
 * @param query 查询参数
 * @returns 流程部署
 */
function getProcessDeployments(
  query: BaseQuery
): AxiosPromise<Page<ProcessDeployment>> {
  return request.get(BASE_URL, { params: query });
}

/**
 * 删除流程部署
 * @param ids 待删除记录的 ID 列表
 */
function deleteProcessDeployments(ids: string[]): AxiosPromise<string | null> {
  return request.delete(`${BASE_URL}/${ids}`);
}

export {
  // 获取流程部署
  getProcessDeployments,
  // 删除流程部署
  deleteProcessDeployments,
};
