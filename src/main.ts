import { type App as VueApp, createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// 导航守卫
import "@/router/navigation-guard.ts";
// 公共样式
import "./assets/styles/index.scss";
// i18n
import i18n from "./locale";
// svg
import "virtual:svg-icons-register";
// element-plus
import "@/assets/styles/element/index.scss";
// 自定义指令
import * as directives from "@/directive";
// pinia 插件
import { resetState } from "@/util/pinia-plugins";
// vxe-table
import {
  // 全局对象
  VXETable,

  // 表格功能
  Filter,
  Edit,
  Menu,
  Export,
  Keyboard,
  Validator,

  // 可选组件
  Icon,
  Column,
  Colgroup,
  // Grid,
  Tooltip,
  // Toolbar,
  // Pager,
  // Form,
  // FormItem,
  // FormGather,
  // Checkbox,
  // CheckboxGroup,
  // Radio,
  // RadioGroup,
  // RadioButton,
  // Switch,
  // Input,
  // Select,
  // Optgroup,
  // Option,
  // Textarea,
  // Button,
  // Modal,
  // List,
  // Pulldown,

  // 表格
  Table,
} from "vxe-table";

// 按需加载的方式默认是不带国际化的，自定义国际化需要自行解析占位符
VXETable.setup({
  i18n: (key, args) => i18n.global.t(key, args),
  // 对参数中的列头、校验提示..等进行自动翻译（只对支持国际化的有效）
  translate(key, args) {
    // 只翻译 "vxeApp." 开头的键值
    if (key && key.indexOf("vxeApp.") > -1) {
      return i18n.global.t(key, args);
    }
    return key;
  },
});

function useTable(app: VueApp) {
  // 表格功能
  app.use(Filter).use(Edit).use(Menu).use(Export).use(Keyboard).use(Validator);

  // 可选组件
  app
    .use(Icon)
    .use(Column)
    .use(Colgroup)
    // .use(Grid)
    .use(Tooltip)
    // .use(Toolbar)
    // .use(Pager)
    // .use(Form)
    // .use(FormItem)
    // .use(FormGather)
    // .use(Checkbox)
    // .use(CheckboxGroup)
    // .use(Radio)
    // .use(RadioGroup)
    // .use(RadioButton)
    // .use(Switch)
    // .use(Input)
    // .use(Select)
    // .use(Optgroup)
    // .use(Option)
    // .use(Textarea)
    // .use(Button)
    // .use(Modal)
    // .use(List)
    // .use(Pulldown)

    // 安装表格
    .use(Table);
}

const app = createApp(App);
const pinia = createPinia();

pinia.use(resetState);

app.use(router);
app.use(pinia);
app.use(i18n);
app.use(useTable);

Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as any)[key]());
});

app.mount("#app");
