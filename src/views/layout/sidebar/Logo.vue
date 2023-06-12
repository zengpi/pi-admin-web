<script setup lang="ts">
/**
 * Logo
 * @author ZnPi
 * @date 2022-03-04
 */
import settings from "@/settings";

withDefaults(
  defineProps<{
    showTitle?: boolean;
    showLogo?: boolean;
  }>(),
  {
    showTitle: true,
    showLogo: true,
  }
);
</script>

<template>
  <div class="logo-container">
    <RouterLink class="sidebar-logo-link" to="/">
      <img v-if="showLogo" src="@/assets/icons/logo.svg" class="sidebar-logo" />
      <h1 v-if="showTitle" class="sidebar-title">{{ settings.title }}</h1>
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.logo-container {
  height: $logo-height;
  line-height: $logo-height;
  text-align: center;

  .sidebar-logo-link {
    height: 100%;
    width: 100%;

    .sidebar-logo {
      width: 35px;
      height: 35px;
      vertical-align: middle;
    }

    .sidebar-title {
      display: inline-block;
      margin: 0;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      vertical-align: middle;
      margin-left: 12px;
    }
  }
}
</style>
