import EnhancementRenderer from "./EnhancementRenderer";
import type { ModuleDeclaration } from "didi";

const enhancementRenderer: ModuleDeclaration = {
  __init__: ["enhancementRenderer"],
  enhancementRenderer: ["type", EnhancementRenderer],
};

export default enhancementRenderer;
