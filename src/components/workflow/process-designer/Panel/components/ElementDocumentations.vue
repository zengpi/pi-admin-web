<script lang="ts">
import { defineComponent } from "vue";

import { Document } from "@element-plus/icons-vue";

import { mapState } from "pinia";

import type { Base } from "diagram-js/lib/model";

import modelerStore from "@/stores/workflow/modeler";

import {
  getDocumentValue,
  setDocumentValue,
} from "@/util/workflow/bo-utils/documentationUtil";
import EventEmitter from "@/util/workflow/EventEmitter";

import CollapseTitle from "@/components/workflow/process-designer/common/CollapseTitle.vue";

export default defineComponent({
  name: "ElementDocumentations",
  components: {
    Document,
    CollapseTitle,
  },
  data() {
    return {
      elementDoc: "",
    };
  },
  computed: {
    ...mapState(modelerStore, ["getActive", "getActiveId"]),
  },
  watch: {
    getActiveId: {
      immediate: true,
      handler() {
        this.elementDoc = getDocumentValue(this.getActive as Base) || "";
      },
    },
  },
  mounted() {
    this.elementDoc = getDocumentValue(this.getActive as Base) || "";
    EventEmitter.on("element-update", () => {
      this.elementDoc = getDocumentValue(this.getActive as Base) || "";
    });
  },
  methods: {
    updateElementDoc(value: any) {
      setDocumentValue(this.getActive as Base, value);
    },
  },
});
</script>

<template>
  <ElCollapseItem name="element-documentations">
    <template #title>
      <CollapseTitle :title="$t('panel.documentationSettings')">
        <el-icon class="header-icon">
          <Document />
        </el-icon>
      </CollapseTitle>
    </template>
    <el-form label-width="120px" @submit.prevent>
      <el-form-item :label="$t('panel.documentationBody')" :label-width="120">
        <el-input
          v-model="elementDoc"
          type="textarea"
          @change="updateElementDoc"
        />
      </el-form-item>
    </el-form>
  </ElCollapseItem>
</template>
