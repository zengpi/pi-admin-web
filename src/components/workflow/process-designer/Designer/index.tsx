import { defineComponent, ref, toRefs, nextTick, watch } from "vue";
import type { PropType } from "vue";
import { storeToRefs } from "pinia";

import editor from "@/stores/workflow/editor";
import modulesAndModdle from "@/components/workflow/process-designer/Designer/modulesAndModdle";
import initModeler from "@/components/workflow/process-designer/Designer/initModeler";
import { createNewDiagram } from "@/util/workflow";

const Designer = defineComponent({
  name: "Designer",
  props: {
    xml: {
      type: String as PropType<string>,
      default: undefined,
    },
  },
  emits: ["update:xml", "command-stack-changed"],
  setup(props, { emit }) {
    const editorStore = editor();
    const { editorSettings } = storeToRefs(editorStore);
    const { xml } = toRefs(props);
    const designer = ref<HTMLDivElement | null>(null);

    watch(
      () => editorSettings.value,
      async (value, oldValue) => {
        try {
          const modelerModules = modulesAndModdle(editorSettings);
          await nextTick();
          initModeler(designer, modelerModules, emit);
          if (
            !xml.value &&
            (!oldValue || value.processEngine !== oldValue!.processEngine)
          ) {
            await createNewDiagram();
          } else {
            await createNewDiagram(xml.value, editorSettings.value);
          }
        } catch (e) {
          console.error(e);
        }
      },
      { deep: true, immediate: true }
    );

    return () => <div ref={designer} class="designer"></div>;
  },
});

export default Designer;
