<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";

import { Clock } from "@element-plus/icons-vue";

import modeler from "@/stores/workflow/modeler";
import {
  getExternalTaskValue,
  getRetryTimeCycleValue,
  retryTimeCycleVisible,
  setExternalTaskValue,
  setRetryTimeCycleValue,
  taskPriorityVisible,
} from "@/util/workflow/bo-utils/jobExecutionUtil";
import type { Base } from "diagram-js/lib/model";
import EventEmitter from "@/util/workflow/EventEmitter";

import CollapseTitle from "@/components/workflow/process-designer/common/CollapseTitle.vue";

export default defineComponent({
  name: "ElementJobExecution",
  components: {
    Clock,
    CollapseTitle,
  },
  setup() {
    const modelerStore = modeler();
    const getActive = computed<Base | null>(() => modelerStore.getActive!);
    const getActiveId = computed<string>(() => modelerStore.getActiveId!);

    const retryTimeCycle = ref<string | undefined>(undefined);
    const rtVisible = ref<boolean>(false);
    const getRetryTimeCycle = () => {
      rtVisible.value = retryTimeCycleVisible(getActive.value!);
      retryTimeCycle.value = getRetryTimeCycleValue(getActive.value!) || "";
    };
    const setRetryTimeCycle = (value: string | undefined) => {
      setRetryTimeCycleValue(getActive.value!, value);
    };

    const taskPriority = ref<string | undefined>(undefined);
    const tpVisible = ref<boolean>(false);
    const getExternalTaskPriority = () => {
      tpVisible.value = taskPriorityVisible(getActive.value!);
      taskPriority.value = getExternalTaskValue(getActive.value!) || "";
    };
    const setExternalTaskPriority = (value: string | undefined) => {
      setExternalTaskValue(getActive.value!, value);
    };

    watch(
      () => getActiveId.value,
      () => {
        getRetryTimeCycle();
        getExternalTaskPriority();
      },
      { immediate: true }
    );

    onMounted(() => {
      getRetryTimeCycle();
      getExternalTaskPriority();

      EventEmitter.on("element-update", () => {
        getRetryTimeCycle();
        getExternalTaskPriority();
      });
    });

    return {
      retryTimeCycle,
      rtVisible,
      setRetryTimeCycle,
      taskPriority,
      tpVisible,
      setExternalTaskPriority,
    };
  },
});
</script>

<template>
  <el-collapse-item name="element-external-task">
    <template #title>
      <CollapseTitle :title="$t('panel.executionJob')">
        <el-icon class="header-icon">
          <Clock />
        </el-icon>
      </CollapseTitle>
    </template>
    <div class="element-external-task">
      <el-form label-width="100px" @submit.prevent>
        <el-form-item
          v-if="tpVisible"
          :label="$t('panel.taskPriority')"
          :label-width="100"
        >
          <el-input
            v-model="taskPriority"
            maxlength="32"
            @change="setExternalTaskPriority"
          />
        </el-form-item>
        <el-form-item
          v-if="rtVisible"
          :label="$t('panel.retryTimeCycle')"
          :label-width="100"
        >
          <el-input
            v-model="retryTimeCycle"
            maxlength="32"
            @change="setRetryTimeCycle"
          />
        </el-form-item>
      </el-form>
    </div>
  </el-collapse-item>
</template>
