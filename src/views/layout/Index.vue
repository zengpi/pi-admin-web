<script setup lang="ts">
import useStore from "@/stores";

import settings from "@/settings";

import MainSideBar from "./sidebar/MainSidebar.vue";
import SubSidebar from "./sidebar/SubSidebar.vue";
import Toolbar from "./toolbar/Index.vue";
import Tab from "./Tab.vue";
import MainBody from "./MainBody.vue";

const { useAppStore } = useStore();
</script>

<template>
  <div
    class="layout"
    :class="{ 'sidebar-collapsed': useAppStore.sidebarCollapsed }"
  >
    <div class="sidebar-container">
      <MainSideBar />
      <SubSidebar />
    </div>

    <div class="main-container">
      <div :class="{ 'fixed-header': settings.fixedHeader }">
        <Toolbar />
        <Tab />
      </div>
      <MainBody />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.layout {
  height: 100%;
  width: 100%;

  .sidebar-container {
    width: calc($main-sidebar-with + $sub-sidebar-width);

    position: fixed;
    z-index: 1001;
    top: 0;
    bottom: 0;
    display: flex;
  }

  .main-container {
    height: 100%;
    margin-left: calc($main-sidebar-with + $sub-sidebar-width);

    .fixed-header {
      position: fixed;
      width: calc(100% - calc($main-sidebar-with + $sub-sidebar-width));
      top: 0;
      right: 0;
      z-index: 9;
    }
  }
}
</style>
