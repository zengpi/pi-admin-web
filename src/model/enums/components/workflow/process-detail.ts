/**
 * 审批按钮类型
 */
enum APPROVE_BTN_TYPE {
  /**
   * 抄送人
   */
  COPY = 1,
  /**
   * 下一级审批人
   */
  NEXT,
  /**
   * 委派
   */
  DELEGATE,
  /**
   * 转办
   */
  TRANSFER,
}

export { APPROVE_BTN_TYPE };
