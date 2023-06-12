<script lang="ts">
import { defineComponent } from "vue";

import { HelpFilled } from "@element-plus/icons-vue";

import { mapState } from "pinia";

import type { Base } from "diagram-js/lib/model";

import modelerStore from "@/stores/workflow/modeler";

import {
  getACAfter,
  getACBefore,
  getACExclusive,
  setACAfter,
  setACBefore,
  setACExclusive,
} from "@/util/workflow/bo-utils/asynchronousContinuationsUtil";
import EventEmitter from "@/util/workflow/EventEmitter";

import CollapseTitle from "@/components/workflow/process-designer/common/CollapseTitle.vue";

export default defineComponent({
  name: "ElementAsyncContinuations",
  components: {
    HelpFilled,
    CollapseTitle,
  },
  data() {
    return {
      acBefore: false,
      acAfter: false,
      acExclusive: false,
    };
  },
  computed: {
    ...mapState(modelerStore, ["getActive", "getActiveId"]),
    showExclusive() {
      return this.acBefore || this.acAfter;
    },
  },
  mounted() {
    this.reloadACStatus();
    EventEmitter.on("element-update", this.reloadACStatus);
  },
  methods: {
    reloadACStatus() {
      this.acBefore = getACBefore(this.getActive as Base);
      this.acAfter = getACAfter(this.getActive as Base);
      this.acExclusive = getACExclusive(this.getActive as Base);
    },
    updateElementACBefore(value: boolean) {
      setACBefore(this.getActive as Base, value);
      this.reloadACStatus();
    },
    updateElementACAfter(value: boolean) {
      setACAfter(this.getActive as Base, value);
      this.reloadACStatus();
    },
    updateElementACExclusive(value: boolean) {
      setACExclusive(this.getActive as Base, value);
      this.reloadACStatus();
    },
  },
});
</script>

<template>
  <ElCollapseItem name="element-async-continuations">
    <template #title>
      <CollapseTitle :title="$t('panel.asyncContinuations')">
        <el-icon class="header-icon">
          <HelpFilled />
        </el-icon>
      </CollapseTitle>
    </template>
    <el-form label-width="120px" @submit.prevent>
      <el-form-item :label="$t('panel.asyncBefore')">
        <el-switch v-model="acBefore" @update="updateElementACBefore" />
      </el-form-item>
      <el-form-item :label="$t('panel.asyncAfter')">
        <el-switch v-model="acAfter" @update="updateElementACAfter" />
      </el-form-item>
      <el-form-item v-if="showExclusive" :label="$t('panel.asyncExclusive')">
        <el-switch v-model="acExclusive" @update="updateElementACExclusive" />
      </el-form-item>
    </el-form>
  </ElCollapseItem>
</template>
