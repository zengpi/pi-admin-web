<script setup lang="ts">
/**
 * 二级菜单栏
 * @author ZnPi
 * @date 2023-05-14
 */
import { useRoute } from "vue-router";

import useStore from "@/stores";

import settings from "@/settings";

import Logo from "./Logo.vue";
import SidebarItem from "./SidebarItem.vue";

const { useAppStore, useRouterStore } = useStore();
const route = useRoute();
</script>

<template>
  <div
    class="sub-sidebar-container"
    :class="{ 'has-logo': settings.showLogo && !useAppStore.sidebarCollapsed }"
  >
    <Logo
      v-if="settings.showLogo && !useAppStore.sidebarCollapsed"
      :show-logo="false"
    />

    <el-scrollbar class="scrollbar">
      <template
        v-for="(router, index) in useRouterStore.dynamicRouters"
        :key="index"
      >
        <el-menu
          v-show="index === useRouterStore.activedMainSidebarMenuItem"
          unique-opened
          :default-active="route.path"
          :collapse="useAppStore.sidebarCollapsed"
          :collapse-transition="false"
        >
          <SidebarItem
            v-for="childRouter in router.children"
            :item="childRouter"
            :key="childRouter.path"
            :base-path="`${childRouter.path}`"
            :main-sidebar-path="router.path"
          />
        </el-menu>
      </template>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.sub-sidebar-container {
  width: $sub-sidebar-width;
  height: 100%;
  position: fixed;
  overflow: hidden;
  z-index: 1001;
  box-shadow: 10px 0 10px -10px var(--el-color-primary-light-7);
  left: $main-sidebar-with;

  .el-menu {
    border: none;
    height: 100%;
    width: 100%;
  }
}

.sidebar-collapsed .sub-sidebar-container {
  width: calc(
    var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2
  );
}

.has-logo {
  .scrollbar {
    height: calc(100% - $logo-height) !important;
  }
}
</style>
