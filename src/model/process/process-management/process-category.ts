class ProcessCategory {
  /**
   * 标识
   */
  id?: number;
  /**
   * 分类编码
   */
  code?: string;
  /**
   * 分类名称
   */
  name?: string;
  /**
   * 备注
   */
  remark?: string;
}

class ProcessCategoryDialog {
  dialogVisiable: boolean = false;
}

export { ProcessCategory, ProcessCategoryDialog };
