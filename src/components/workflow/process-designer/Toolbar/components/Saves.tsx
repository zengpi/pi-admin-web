import { defineComponent } from "vue";

import { ElButton } from "element-plus";

import { useI18n } from "vue-i18n";

import modeler from "@/stores/workflow/modeler";

const Saves = defineComponent({
  setup() {
    const { t } = useI18n();

    const modelerStore = modeler();

    const saveProcess = async () => {
      modelerStore.switchSaveFlag();
    };

    return () => (
      <ElButton type="primary" plain onClick={saveProcess}>
        {t("toolbar.saveProcess")}
      </ElButton>
    );
  },
});

export default Saves;
