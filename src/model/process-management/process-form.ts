class ProcessDefinitionForm {
  /**
   * 唯一标识
   */
  id?: number;
  /**
   * 表单名称
   */
  name?: string;
  /**
   * 是否内置
   */
  builtIn?: number = 0;
  /**
   * 组件路径（如果为内置表单，则需要填写组件路径）
   */
  componentPath?: string;
  /**
   * 备注
   */
  remark?: string;
}

class FormDialog {
  dialogVisible = false;
}

export { ProcessDefinitionForm, FormDialog };
