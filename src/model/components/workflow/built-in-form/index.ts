class LeaveFormData {
  /**
   * 主键
   */
  id?: number;
  /**
   * 用户名
   */
  username?: string;
  /**
   * 姓名
   */
  name?: string;
  /**
   * 部门
   */
  deptName?: string;
  /**
   * 请假类型
   */
  type?: string = "事假";
  /**
   * 请假时间
   */
  time?: string[];
  /**
   * 请假累计天数
   */
  durationDay?: number;
  /**
   * 请假累计小时
   */
  durationHour?: number = 0;
  /**
   * 假期代理人
   */
  agent?: string;
  /**
   * 部门领导审批
   */
  candidates?: string;
  /**
   * 部门领导姓名
   */
  candidateNames?: string;
  /**
   * 请假事由
   */
  reason?: string;
}

export { LeaveFormData };
