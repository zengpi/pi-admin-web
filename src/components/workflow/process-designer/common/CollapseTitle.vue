<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CollapseTitle",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
});
</script>

<template>
  <div class="collapse-title">
    <slot></slot>
    <span class="title-content">{{ title }}</span>
  </div>
</template>

<style scoped lang="scss">
.collapse-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #303133;
  font-weight: bold;

  .title-content {
    margin-left: 8px;
  }
}
</style>
