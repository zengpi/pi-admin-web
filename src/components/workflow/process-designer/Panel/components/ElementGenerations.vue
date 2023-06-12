<script lang="ts">
import { defineComponent } from "vue";

import { ElMessage } from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue";

import { mapState } from "pinia";

import type { Base } from "diagram-js/lib/model";

import modelerStore from "@/stores/workflow/modeler";
import { getNameValue, setNameValue } from "@/util/workflow/bo-utils/nameUtil";
import { setIdValue } from "@/util/workflow/bo-utils/idUtil";
import {
  getProcessExecutable,
  getProcessVersionTag,
  setProcessExecutable,
  setProcessVersionTag,
} from "@/util/workflow/bo-utils/processUtil";
import EventEmitter from "@/util/workflow/EventEmitter";

import CollapseTitle from "@/components/workflow/process-designer/common/CollapseTitle.vue";

export default defineComponent({
  name: "ElementGenerations",
  components: {
    InfoFilled,
    CollapseTitle,
  },
  data() {
    return {
      elementId: "",
      elementName: "",
      elementVersion: "",
      elementExecutable: true,
      isProcess: false,
    };
  },
  computed: {
    ...mapState(modelerStore, ["getActive", "getActiveId"]),
  },
  mounted() {
    this.reloadGenerationData();
    EventEmitter.on("element-update", this.reloadGenerationData);
  },
  methods: {
    reloadGenerationData() {
      this.isProcess =
        !!this.getActive && this.getActive.type === "bpmn:Process";
      this.elementId = this.getActiveId as string;
      this.elementName = getNameValue(this.getActive as Base) || "";
      if (this.isProcess) {
        this.elementExecutable = getProcessExecutable(this.getActive as Base);
        this.elementVersion =
          getProcessVersionTag(this.getActive as Base) || "";
      }
    },
    updateElementName(value: string) {
      setNameValue(this.getActive as Base, value);
    },
    updateElementId(value: string) {
      setIdValue(this.getActive as Base, value);
    },
    updateElementVersion(value: string) {
      const reg = /((\d|([1-9](\d*))).){2}(\d|([1-9](\d*)))/;
      if (reg.test(value)) {
        setProcessVersionTag(this.getActive as Base, value);
      } else {
        ElMessage.error("版本号必须符合语义化版本2.0.0 要点");
      }
    },
    updateElementExecutable(value: boolean) {
      setProcessExecutable(this.getActive as Base, value);
    },
  },
});
</script>

<template>
  <ElCollapseItem name="base-info">
    <template #title>
      <CollapseTitle :title="$t('panel.general')">
        <el-icon class="header-icon">
          <InfoFilled />
        </el-icon>
      </CollapseTitle>
    </template>

    <el-form label-width="90px" @submit.prevent>
      <el-form-item :label="$t('panel.id')">
        <el-input
          v-model="elementId"
          maxlength="32"
          @change="updateElementId"
        />
      </el-form-item>

      <el-form-item :label="$t('panel.name')">
        <el-input
          v-model="elementName"
          maxlength="20"
          @change="updateElementName"
        />
      </el-form-item>

      <template v-if="isProcess">
        <el-form-item key="version" :label="$t('panel.version')">
          <el-input
            v-model="elementVersion"
            maxlength="20"
            @change="updateElementVersion"
          />
        </el-form-item>

        <el-form-item key="executable" :label="$t('panel.executable')">
          <el-switch
            v-model="elementExecutable"
            @update="updateElementExecutable"
          />
        </el-form-item>
      </template>
    </el-form>
  </ElCollapseItem>
</template>
