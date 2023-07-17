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

enum BuiltInFormEnum {
  /**
   * 非内置表单
   */
  NOT_BUILT_IN,
  /**
   * 内置表单
   */
  BUILT_IN
}

enum FormFieldType {
  /**
   * rendered as a text field
   */
  TEXT = "text",
  /**
   * rendered as a text area field
   */
  MULTI_LINE_TEXT = "multi-line-text",
  /**
   *  rendered as a text field, but only allows numeric values
   */
  INTEGER = "integer",
  /**
  * rendered as a checkbox field
  */
  BOOLEAN = "boolean",
  /**
   *  rendered as a date field
   */
  DATE = "date",
  /**
   *  rendered as a datetime field
   */
  DATETIME = "datetime",
  /**
  *  rendered as a select field with the option values configured in the field definition
  */
  DROPDOWN = "dropdown",
  /**
   * rendered as a radio field with the option values configured in the field definition
   */
  RADIO_BUTTONS = "radio-buttons",
  /**
  * rendered as a select field where a person from the Identity user table can be selected
  */
  PEOPLE = "people",
  /**
   * rendered as a select field where a group from the Identity group table can be selected
   */
  FUNCTIONAL_GROUP = "functional-group",
  /**
  * rendered as an upload field
  */
  UPLOAD = "upload",
  /**
   * rendered as a label and allows you to use JUEL expressions to use variables and/or other dynamic values in the label text
   */
  EXPRESSION = "expression",
}

export { APPROVE_BTN_TYPE, BuiltInFormEnum, FormFieldType };
