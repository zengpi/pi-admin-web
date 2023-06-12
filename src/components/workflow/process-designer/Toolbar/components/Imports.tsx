import { defineComponent, ref } from "vue";
import { ElButton } from "element-plus";
import modeler from "@/stores/workflow/modeler";
import { useI18n } from "vue-i18n";

const Imports = defineComponent({
  name: "Imports",
  setup() {
    const { t } = useI18n();
    const modelerStore = modeler();
    const importRef = ref<HTMLInputElement | null>(null);

    const openImportWindow = () => {
      importRef.value && importRef.value.click();
    };

    const changeImportFile = () => {
      if (importRef.value && importRef.value.files) {
        const file = importRef.value.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
          const xmlStr = this.result;
          modelerStore.getModeler!.importXML(xmlStr as string);
        };
        importRef.value.value = "";
        importRef.value.files = null;
      }
    };

    return () => (
      <>
        <ElButton type="primary" plain onClick={openImportWindow}>
          {t("toolbar.openFile")}
        </ElButton>
        <input
          type="file"
          ref={importRef}
          style="display: none"
          accept=".xml,.bpmn"
          onChange={changeImportFile}
        ></input>
      </>
    );
  },
});

export default Imports;
