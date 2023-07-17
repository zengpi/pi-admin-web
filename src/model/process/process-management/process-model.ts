class MetaInfo {
  /**
   * 表单ID
   */
  formId?: string;
  /**
   * 表单类型
   */
  formType?: string;
  /**
   * 描述
   */
  description?: string;
}

class ProcessModel {
  /**
   * 主键
   */
  id?: string;
  /**
   * 模型名称
   */
  name?: string;
  /**
   * 模型标识
   */
  key?: string;
  /**
   * 分类
   */
  category?: string;
  /**
   * 版本
   */
  version?: number;
  /**
   * 元信息
   */
  metaInfo: MetaInfo = new MetaInfo();
}

class SaveModelDesign {
  /**
   * 主键
   */
  id?: string;

  /**
   * xml 文件
   */
  bpmnXml?: string;

  /**
   * 是否新版本
   */
  newVersion?: boolean;

  constructor(id?: string, bpmnXml?: string, newVersion?: boolean) {
    this.id = id;
    this.bpmnXml = bpmnXml;
    this.newVersion = newVersion;
  }
}

class ProcessModelQuery {
  pageNum = 1;
  pageSize = 10;
  key?: string;
  name?: string;
  category?: string;
}

class DesignerDialog {
  dialogVisible = false;
  props: {
    modelId: string | null;
    modelName: string | null;
    xml?: string;
  } = {
    modelId: null,
    modelName: null,
  };
}

export { ProcessModel, ProcessModelQuery, DesignerDialog, SaveModelDesign };
