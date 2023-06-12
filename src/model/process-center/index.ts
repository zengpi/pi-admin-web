class ProcessForm {
  /**
   * 表单 ID
   */
  id?: number;
  /**
   * 表单名称
   */
  name?: string;
  /**
   * 组件路径（如果为内置表单，则组件路径不为空）
   */
  componentPath?: string;
  /**
   * 是否内置
   */
  builtIn?: number;
  /**
   * 表单数据
   */
  formData?: object;

  /**
   * 表单组件（前端自己生成）
   */
  formComponent?: any;
}

class ProcessDetailDialog {
  dialogVisible: boolean = false;
  processInstanceId?: string;
  taskId?: string;
}

export { ProcessForm, ProcessDetailDialog };
