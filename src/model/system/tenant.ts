class Tenant {
  /**
   * 主键
   */
  id?: number;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 租户编码
   */
  tenantCode?: string;
  /**
   * 企业主键
   */
  enterpriseId?: number;
  /**
   * 企业名称
   */
  enterpriseName?: string;
  /**
   * 租户管理员主键
   */
  AdminId?: number;
  /**
   * 联系人
   */
  contact?: string;
  /**
   * 账号
   */
  account?: string;
  /**
   * 手机
   */
  phone?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 密码
   */
  password?: string;
  /**
   * 租户套餐主键
   */
  packageId?: number;
  /**
   * 租户套餐
   */
  packageName?: string;
  /**
   * 到期时间
   */
  expires?: string;

  /**
   * 用户数量(-1:=不限制)
   */
  userQuantity: number = -1;

  /**
   * 状态（0:=禁用; 1:=启用）
   */
  enabled: number = 1;

  /**
   * 备注
   */
  remark?: string;
}

class LoginTenant {
  /**
   * 租户编码
   */
  tenantCode?: string;
  /**
   * 企业名称
   */
  enterpriseName?: string;
}

export { Tenant, LoginTenant };
