import RewriteRenderer from "./RewriteRenderer";
import type { ModuleDeclaration } from "didi";

const rewriteRenderer: ModuleDeclaration = {
  __init__: ["bpmnRenderer"],
  bpmnRenderer: ["type", RewriteRenderer],
};

export default rewriteRenderer;
