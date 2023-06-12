import { defineStore } from "pinia";
import type { Moddle } from "moddle";
import type { Base } from "diagram-js/lib/model";
import type Modeler from "bpmn-js/lib/Modeler";
import type Modeling from "bpmn-js/lib/features/modeling/Modeling.js";
import type Canvas from "diagram-js/lib/core/Canvas";
import type ElementRegistry from "diagram-js/lib/core/ElementRegistry";

type ModelerStore = {
  activeElement: Base | undefined;
  activeElementId: string | undefined;
  modeler: Modeler | null;
  moddle: Moddle | null;
  modeling: Modeling | null;
  canvas: Canvas | null;
  elementRegistry: ElementRegistry | null;
  saveFlag: boolean;
};

const defaultState: ModelerStore = {
  activeElement: undefined,
  activeElementId: undefined,
  modeler: null,
  moddle: null,
  modeling: null,
  canvas: null,
  elementRegistry: null,
  saveFlag: false,
};

export default defineStore("modeler", {
  state: () => defaultState,
  getters: {
    getActive: (state) => state.activeElement,
    getActiveId: (state) => state.activeElementId,
    getModeler: (state) => state.modeler,
    getModdle: (state) => state.moddle,
    getModeling: (state) => state.modeling,
    getCanvas: (state) => state.canvas,
    getElRegistry: (state) => state.elementRegistry,
    getSaveFlag: (state) => state.saveFlag,
  },
  actions: {
    setModeler(modeler: any) {
      this.modeler = modeler;
    },
    setModules<K extends keyof ModelerStore>(key: K, module: any) {
      this[key] = module;
    },
    setElement(element: Base, id: string) {
      this.activeElement = element;
      this.activeElementId = id;
    },
    switchSaveFlag() {
      this.saveFlag = !this.saveFlag;
    },
  },
});
