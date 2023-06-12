import zh_CN from "../../../../locale/bpmn/zh_CN";
import en_US from "../../../../locale/bpmn/en_US";

const languages = {
  zh_CN,
  en_US,
};

const lang = sessionStorage.getItem("lang");

export function customTranslate(
  template: string,
  replacements?: Record<string, string>
) {
  replacements = replacements || {};

  const translations = (languages as any)[lang || "zh_CN"];

  // Translate
  template = translations.elements[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function (_, key) {
    return replacements![key] || "{" + key + "}";
  });
}

export default {
  translate: ["value", customTranslate],
};
