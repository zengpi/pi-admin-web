class SelectOptions {
  id?: string;
  name?: string;
}

class FormField {
  id?: string;
  name?: string;
  type?: string;
  options?: Array<SelectOptions>;
  value?: any;
  required?: boolean;
  readOnly?: boolean;
  overrideId?: boolean;
  placeholder?: string;
  params?: Map<string, any>;
}

class ProcessDefinitionForm {
  /**
   * 唯一标识
   */
  id?: string;
  /**
   * 表单 key
   */
  formKey?: string;
  /**
   * 表单名称
   */
  name?: string;
  /**
   * 版本
   */
  version?: number;
  /**
   * 是否内置
   */
  builtIn?: number = 0;
  /**
   * 组件路径（如果为内置表单，则需要填写组件路径）
   */
  componentPath?: string;
  /**
   * 表单组件
   */
  formComponent?: any;
  /**
   * 表单字段（如果为非内置表单）
   */
  fields?: Array<FormField>;
  /**
   * 描述
   */
  description?: string;
  /**
   * 表单数据
   */
  formData?: Object = {};
}

class FormDialog {
  dialogVisible = false;
}

export { ProcessDefinitionForm, FormField, FormDialog, SelectOptions };
