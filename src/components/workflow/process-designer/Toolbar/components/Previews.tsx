import { defineComponent, ref } from "vue";

import { ElButton, ElDialog, ElPopover, ElMessage } from "element-plus";

import Codemirror from "codemirror-editor-vue3";
import "codemirror/theme/monokai.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/xml/xml.js";

import { useI18n } from "vue-i18n";

import BpmnModdle from "bpmn-moddle";

import modeler from "@/stores/workflow/modeler";

const Previews = defineComponent({
  name: "Previews",
  setup() {
    const { t } = useI18n();

    const modelerStore = modeler();

    const moddle = new BpmnModdle();

    const dialog = ref({
      dialogVisiable: false,
      title: "",
      previewValue: "",
      type: "xml",
    });

    const codemirrorOptions = {
      mode: "xml", // 语言模式
      theme: "monokai", // 主题
      lineNumbers: false, // 显示行号
      smartIndent: true, // 智能缩进
      readOnly: true,
      indentUnit: 2, // 智能缩进单位为4个空格长度
      foldGutter: true, // 启用行槽中的代码折叠
      styleActiveLine: true, // 显示选中行的样式
    };

    const openXMLPreviewModel = async () => {
      try {
        const modeler = modelerStore.getModeler!;

        if (!modeler) {
          return ElMessage.warning("模型加载失败，请刷新重试");
        }

        const { xml } = await modeler.saveXML({ format: true, preamble: true });

        codemirrorOptions.mode = "xml";
        dialog.value.dialogVisiable = true;
        dialog.value.title = t("toolbar.previewAs");
        dialog.value.previewValue = xml!;
      } catch (e) {
        ElMessage.error((e as Error).message || (e as string));
      }
    };

    const openJsonPreviewModel = async () => {
      const modeler = modelerStore.getModeler!;

      if (!modeler) {
        return ElMessage.warning("模型加载失败，请刷新重试");
      }

      const { xml } = await modeler.saveXML({ format: true });

      const jsonStr = await moddle.fromXML(xml!);

      codemirrorOptions.mode = "application/json";
      dialog.value.previewValue = JSON.stringify(jsonStr, null, 2);
      dialog.value.title = t("toolbar.previewAs");
      dialog.value.dialogVisiable = true;
    };

    return () => (
      <>
        <ElPopover
          v-slots={{
            reference: () => (
              <ElButton type="primary" plain>
                {t("toolbar.previewAs")}
              </ElButton>
            ),
            default: () => (
              <div class="button-list_column">
                <ElButton type="primary" onClick={openXMLPreviewModel}>
                  {t("toolbar.previewAsXML")}
                </ElButton>
                <ElButton type="primary" onClick={openJsonPreviewModel}>
                  {t("toolbar.previewAsJSON")}
                </ElButton>
              </div>
            ),
          }}
        ></ElPopover>

        <ElDialog
          v-model={dialog.value.dialogVisiable}
          title={dialog.value.title}
          append-to-body
          destroy-on-close
          draggable
          width="60%"
        >
          <Codemirror
            v-model:value={dialog.value.previewValue}
            options={codemirrorOptions}
            border
            height={600}
          />
        </ElDialog>
      </>
    );
  },
});

export default Previews;
