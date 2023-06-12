import type { ModdleElement } from "bpmn-moddle";
import editor from "@/stores/workflow/editor";
import modeler from "@/stores/workflow/modeler";

export function createScript(props: ScriptForm): ModdleElement {
  const prefix = editor().getProcessEngine;
  const moddle = modeler().getModdle;
  const { scriptFormat, value, resource } = props;

  return moddle!.create(`${prefix}:Script`, { scriptFormat, value, resource });
}

export function getScriptType(script: ModdleElement & BpmnScript): string {
  if (script.get("resource")) {
    return "External Resource";
  }
  if (script.get("value")) {
    return "Inline Script";
  }
  return "none";
}
