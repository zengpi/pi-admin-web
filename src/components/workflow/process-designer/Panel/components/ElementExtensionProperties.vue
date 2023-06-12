<script lang="ts">
import { h, defineComponent, toRaw, markRaw } from "vue";

import { ElButton, ElForm } from "element-plus";
import { Expand } from "@element-plus/icons-vue";

import { mapState } from "pinia";
import modelerStore from "@/stores/workflow/modeler";
import type { Base } from "diagram-js/lib/model";
import {
  addExtensionProperty,
  getExtensionProperties,
  removeExtensionProperty,
} from "@/util/workflow/bo-utils/extensionPropertiesUtil";
import EventEmitter from "@/util/workflow/EventEmitter";

import CollapseTitle from "@/components/workflow/process-designer/common/CollapseTitle.vue";

export default defineComponent({
  name: "ElementExtensionProperties",
  components: {
    Expand,
    CollapseTitle,
  },
  data() {
    return {
      extensions: [],
      extensionsRaw: [],
      newProperty: { name: "", value: "" },
      rules: {
        name: {
          required: true,
          message: "属性名称不能为空",
          trigger: ["blur"],
        },
        value: { required: true, message: "属性值不能为空", trigger: ["blur"] },
      },
      modelVisible: false,
    };
  },
  computed: {
    ...mapState(modelerStore, ["getActive", "getActiveId"]),
  },
  watch: {
    getActiveId: {
      immediate: true,
      handler() {
        this.reloadExtensionProperties();
      },
    },
  },
  mounted() {
    this.reloadExtensionProperties();
    EventEmitter.on("element-update", this.reloadExtensionProperties);
  },
  methods: {
    async reloadExtensionProperties() {
      this.modelVisible = false;
      await this.$nextTick();
      this.newProperty = { name: "", value: "" };
      (this.extensionsRaw as any[]) = markRaw(
        getExtensionProperties(this.getActive as Base)
      );
      this.extensions = JSON.parse(JSON.stringify(this.extensionsRaw));
    },
    removeProperty(propIndex: number) {
      removeExtensionProperty(
        this.getActive as Base,
        this.extensionsRaw[propIndex]
      );
      this.reloadExtensionProperties();
    },
    async addProperty() {
      (this.$refs.formRef as any).validate((valid) => {
        if (valid) {
          addExtensionProperty(this.getActive as Base, toRaw(this.newProperty));
          this.reloadExtensionProperties();
        }
      });
    },
    async openPropertyModel() {
      this.modelVisible = true;
      await this.$nextTick();
      (this.$refs.formRef as any).resetFields();
    },
  },
});
</script>

<template>
  <ElCollapseItem name="element-extension-properties">
    <template #title>
      <CollapseTitle :title="$t('panel.extensionProperties')">
        <el-icon class="header-icon">
          <Expand />
        </el-icon>
      </CollapseTitle>
      <el-tag round style="margin: 0 0 0 auto">
        {{ extensions.length }}
      </el-tag>
    </template>
    <div class="element-extension-properties">
      <el-table max-height="20vh" :data="extensions">
        <el-table-column :label="$t('panel.index')" type="index" width="60" />
        <el-table-column property="name" label="Name" show-overflow-tooltip />
        <el-table-column property="value" label="Value" show-overflow-tooltip />
        <el-table-column
          property="operation"
          :label="$t('panel.operations')"
          width="80"
          #default="{ $index }"
        >
          <el-button type="danger" link @click="removeProperty($index)">{{
            $t("panel.remove")
          }}</el-button>
        </el-table-column>
      </el-table>

      <el-button
        type="primary"
        class="inline-large-button"
        @click="openPropertyModel"
      >
        <lucide-icon :size="20" name="Plus" />
        <span>{{ $t("panel.addExtensionProperties") }}</span>
      </el-button>
    </div>

    <el-dialog
      v-model="modelVisible"
      preset="dialog"
      :title="$t('panel.addExtensionProperties')"
      :style="{ width: '640px' }"
    >
      <el-form
        ref="formRef"
        :model="newProperty"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item prop="name" :label="$t('panel.propertyName')">
          <el-input v-model="newProperty.name" @keydown.enter.prevent />
        </el-form-item>
        <el-form-item prop="value" :label="$t('panel.propertyValue')">
          <el-input v-model="newProperty.value" @keydown.enter.prevent />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="addProperty">{{
          $t("panel.confirm")
        }}</el-button>
      </template>
    </el-dialog>
  </ElCollapseItem>
</template>

<style scoped></style>
