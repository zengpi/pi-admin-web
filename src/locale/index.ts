import { createI18n } from "vue-i18n";
import { localStorage } from "@/util/storage";

import en from "./en.json";
import zh from "./zh.json";

import bpmnEn from "./bpmn/en_US";
import bpmnZh from "./bpmn/zh_CN";

import zhCN from "vxe-table/lib/locale/lang/zh-CN";
import enUS from "vxe-table/lib/locale/lang/en-US";

import { LocalStorageEnum, LocaleEnum } from "@/model/enums";

const messages = {
  [LocaleEnum.ZH]: {
    ...zh,
    ...bpmnZh,
    ...zhCN,
  },
  [LocaleEnum.EN]: {
    ...en,
    ...bpmnEn,
    ...enUS,
  },
};

/**
 * 获取 localStorage 中的语言。
 * 如果 localStorage 中不存在，则获取当前系统使用的语言
 * @returns
 */
function getLocale(): string {
  let locale = localStorage.get(LocalStorageEnum.LANGUAGE);
  if (locale) {
    return locale;
  }
  locale = navigator.language.toLowerCase();

  const locales = Object.keys(messages);
  locale = locales.find((e) => locale.indexOf(e) > -1);
  if (locale.toLowerCase() === "zh_cn") {
    locale = "zh";
  }
  return locale ? locale : LocaleEnum.ZH;
}

const i18n = createI18n({
  legacy: false,
  locale: getLocale(),
  messages: messages,
});

export { getLocale };

export default i18n;
