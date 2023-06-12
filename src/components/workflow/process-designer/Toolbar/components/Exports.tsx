import { defineComponent } from "vue";

import { ElButton, ElPopover } from "element-plus";

import { useI18n } from "vue-i18n";

import { downloadFile, setEncoded } from "@/util/workflow/files";

import modeler from "@/stores/workflow/modeler";

const Exports = defineComponent({
  name: "Exports",
  setup() {
    const { t } = useI18n();
    const moderlerStore = modeler();
    // 下载流程图到本地
    /**
     * @param {string} type
     * @param {*} name
     */
    const downloadProcess = async (type: string, name = "diagram") => {
      try {
        const modeler = moderlerStore.getModeler;
        // 按需要类型创建文件并下载
        if (type === "xml" || type === "bpmn") {
          const { err, xml } = await modeler!.saveXML();
          // 读取异常时抛出异常
          if (err) {
            console.error(`[Process Designer Warn ]: ${err.message || err}`);
          }
          const { href, filename } = setEncoded(type.toUpperCase(), name, xml!);
          downloadFile(href, filename);
        } else {
          const { err, svg } = await modeler!.saveSVG();
          // 读取异常时抛出异常
          if (err) {
            return console.error(err);
          }
          const { href, filename } = setEncoded("SVG", name, svg!);
          downloadFile(href, filename);
        }
      } catch (e: any) {
        console.error(`[Process Designer Warn ]: ${e.message || e}`);
      }
    };

    const downloadProcessAsXml = () => {
      downloadProcess("xml");
    };
    const downloadProcessAsBpmn = () => {
      downloadProcess("bpmn");
    };
    const downloadProcessAsSvg = () => {
      downloadProcess("svg");
    };

    return () => (
      <ElPopover
        v-slots={{
          reference: () => (
            <ElButton type="primary" plain>
              {t("toolbar.exportAs")}
            </ElButton>
          ),
          default: () => (
            <div class="button-list_column">
              <ElButton type="primary" onClick={downloadProcessAsBpmn}>
                {t("toolbar.exportAsBPMN")}
              </ElButton>
              <ElButton type="primary" onClick={downloadProcessAsXml}>
                {t("toolbar.exportAsXML")}
              </ElButton>
              <ElButton type="primary" onClick={downloadProcessAsSvg}>
                {t("toolbar.exportAsSVG")}
              </ElButton>
            </div>
          ),
        }}
      ></ElPopover>
    );
  },
});

export default Exports;
