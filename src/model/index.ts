/**
 * 分页查询参数
 */
class PageQuery {
  /**
   * 页码
   */
  pageNum = 1;
  /**
   * 每页记录数
   */
  pageSize = 20;
  /**
   * 排序列
   * {"orderByColumns": "name,age"}
   */
  orderByColumns?: string;
  /**
   * 排序规则
   * 如果所有排序规则都相同，则只需要指定一个：{"orderings": "desc"};
   * 如果规则之一不同，则需要指定多个，并且与 orderByColumns 列数相同：{"orderings": "asc,desc"}
   * </ul>
   */
  orderings?: string;
}

/**
 * 基础查询条件
 */
class BaseQuery extends PageQuery {
  keyWord?: string;
}

class BaseDialog {
  /**
   * 弹窗是否显示
   */
  dialogVisible = false;
}

/**
 * 基础弹窗
 */
class FormDialog<T> extends BaseDialog {
  /**
   * 属性
   */
  props: {
    isEdit?: boolean;
    formData?: T;
  } = {
    isEdit: false,
  };
}

/**
 * 组件间传递的属性
 */
class ComponentProps {
  /**
   * ID
   */
  id?: number;
  /**
   * 名称
   */
  name?: string;

  constructor(id?: number, name?: string) {
    this.id = id;
    this.name = name;
  }
}

/**
 * 选择器
 */
interface Select {
  value: number;
  label: string;
}

/**
 * 树形选择器
 */
interface SelectTree {
  value: number;
  label: string;
  children: Array<SelectTree>;
}

/**
 * 分页结果
 */
interface Page<T> {
  records: T[];
  total: number;
}

/**
 * 响应数据
 */
interface ResponseData<T> {
  code?: string;
  msg?: string;
  success?: boolean;
  time?: string;
  data?: T;
}

export { PageQuery, BaseQuery, FormDialog, BaseDialog, ComponentProps };
export type { SelectTree, Page, ResponseData, Select };
