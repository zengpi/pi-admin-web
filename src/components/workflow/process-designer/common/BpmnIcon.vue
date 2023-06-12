<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BpmnIcon",
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "bpmn-icon-process",
    },
    color: {
      type: String,
      default: "#1d1d1f",
    },
  },
});
</script>

<template>
  <svg class="bpmn-icon" aria-hidden="true">
    <use :xlink:href="`#icon-bpmn-icons-${name}`" :fill="color" />
  </svg>
</template>
