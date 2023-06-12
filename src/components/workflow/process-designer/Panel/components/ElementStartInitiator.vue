<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";

import { VideoPlay } from "@element-plus/icons-vue";

import {
  getInitiatorValue,
  setInitiatorValue,
} from "@/util/workflow/bo-utils/initiatorUtil";
import modeler from "@/stores/workflow/modeler";
import type { Base } from "diagram-js/lib/model";
import EventEmitter from "@/util/workflow/EventEmitter";

import CollapseTitle from "@/components/workflow/process-designer/common/CollapseTitle.vue";

export default defineComponent({
  name: "ElementStartInitiator",
  components: {
    VideoPlay,
    CollapseTitle,
  },
  setup() {
    const modelerStore = modeler();
    const getActive = computed<Base | null>(() => modelerStore.getActive!);
    const initiator = ref<string | undefined>("");

    const getElementInitiator = () => {
      initiator.value = getInitiatorValue(getActive.value!);
    };
    const setElementInitiator = (value: string | undefined) => {
      setInitiatorValue(getActive.value!, value);
    };

    onMounted(() => {
      getElementInitiator();

      EventEmitter.on("element-update", getElementInitiator);
    });

    return {
      initiator,
      setElementInitiator,
    };
  },
});
</script>

<template>
  <ElCollapseItem name="element-start-initiator">
    <template #title>
      <CollapseTitle :title="$t('panel.startInitiator')">
        <el-icon class="header-icon">
          <VideoPlay />
        </el-icon>
      </CollapseTitle>
    </template>
    <div class="element-start-initiator">
      <el-form label-width="100px" @submit.prevent>
        <el-form-item :label="$t('panel.initiator')">
          <el-input v-model="initiator" @change="setElementInitiator" />
        </el-form-item>
      </el-form>
    </div>
  </ElCollapseItem>
</template>
