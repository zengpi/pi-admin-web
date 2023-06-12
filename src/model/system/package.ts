import { BaseQuery } from "..";

class Package {
  /**
   * 主键
   */
  id?: number;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 套餐名称
   */
  name?: string;

  /**
   * 状态(0:=禁用; 1:=启用)
   */
  enabled: number = 1;

  /**
   * 备注
   */
  remark?: string;
}

class PackageQuery extends BaseQuery {
  enabled?: number;

  constructor(enabled?: number) {
    super();
    this.enabled = enabled;
  }
}

export { Package, PackageQuery };
