import { defineComponent, computed, ref, toRefs, watch } from "vue";

import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";

import modeler from "@/stores/workflow/modeler";

import type { EditorSettings } from "@/types/workflow/editor/settings";

import { defaultSettings } from "@/config/workflow";

import Toolbar from "@/components/workflow/process-designer/Toolbar";
import Palette from "@/components/workflow/process-designer/Palette";
import Designer from "@/components/workflow/process-designer/Designer";
import Panel from "@/components/workflow/process-designer/Panel";
// import ContextMenu from '@/components/workflow/process-designer/ContextMenu/index.vue'

hljs.registerLanguage("xml", xml);
hljs.registerLanguage("json", json);

const ProcessDesigner = defineComponent({
  name: "ProcessDesigner",
  props: {
    xml: {
      type: String,
      default: undefined,
    },
  },
  emits: ["update:xml", "save"],
  setup(props, { emit }) {
    const modelerStore = modeler();

    const editorSettings = ref<EditorSettings>({ ...defaultSettings });

    const { xml } = toRefs(props);

    const processXml = ref<string | undefined>(xml.value);

    const customPalette = computed<boolean>(
      () => editorSettings.value.paletteMode === "custom"
    );
    const customPenal = computed<boolean>(
      () => editorSettings.value.penalMode === "custom"
    );
    const showToolbar = computed<boolean>(() => editorSettings.value.toolbar);

    const computedClasses = computed<string>(() => {
      const baseClass = ["designer-container"];
      customPalette.value && baseClass.push("designer-with-palette");
      customPenal.value && baseClass.push("designer-with-penal");
      editorSettings.value.bg === "grid-image" &&
        baseClass.push("designer-with-bg");
      editorSettings.value.bg === "image" &&
        baseClass.push("designer-with-image");

      return baseClass.join(" ");
    });

    watch(
      () => modelerStore.getSaveFlag,
      async () => {
        emit("update:xml", processXml.value);
        emit("save");
      }
    );

    // onMounted(() => {
    //   document.body.addEventListener('contextmenu', function (ev) {
    //     ev.preventDefault()
    //   })
    // })

    /* 组件渲染 */
    return () => (
      <div class={computedClasses.value} id="designer-container">
        {showToolbar.value && <Toolbar></Toolbar>}
        <div class="main-content">
          {customPalette.value && <Palette></Palette>}
          <Designer v-model={[processXml.value, "xml"]}></Designer>
          {customPenal.value ? (
            <Panel></Panel>
          ) : (
            <div class="camunda-penal" id="camunda-penal"></div>
          )}
        </div>
        {/* <Setting v-model={[editorSettings.value, 'settings']}></Setting> */}
        {/* <ContextMenu></ContextMenu> */}
      </div>
    );
  },
});

export default ProcessDesigner;
