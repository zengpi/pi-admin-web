<script lang="ts" setup name="MainSidebar">
/**
 * 一级导航
 * @author ZnPi
 * @date 2023-05-14
 */
import useStore from "@/stores";
import settings from "@/settings";

import Logo from "./Logo.vue";
const { useRouterStore } = useStore();
</script>

<template>
  <div
    class="main-sidebar-container"
    :class="{ 'has-logo': settings.showLogo }"
  >
    <Logo v-if="settings.showLogo" :show-title="false" />

    <el-scrollbar class="scrollbar">
      <template
        v-for="(item, index) in useRouterStore.dynamicRouters"
        :key="index"
      >
        <el-tooltip effect="dark" :content="item.meta?.title" placement="right">
          <div
            v-if="item.children && item.children.length !== 0"
            :key="index"
            class="menu-item"
            :class="{
              active: index === useRouterStore.activedMainSidebarMenuItem,
            }"
            @click="useRouterStore.setActivedMainSidebarMenuItem(index)"
          >
            <el-icon class="menu-icon" v-if="item.meta?.icon">
              <svg-icon :name="item.meta.icon" />
            </el-icon>
            <span class="menu-title">{{ item.meta?.title }}</span>
          </div>
        </el-tooltip>
      </template>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.main-sidebar-container {
  width: $main-sidebar-with;
  color: $main-sidebar-color;
  background-color: $main-sidebar-bg;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;

  // firefox隐藏滚动条
  scrollbar-width: none;

  // chrome隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }

  .menu-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 60px;
    cursor: pointer;

    &:hover {
      background-color: $main-sidebar-hover-bg;
    }

    &.active {
      color: $main-sidebar-active-color;
      background-color: $main-sidebar-active-bg;
      font-weight: bold;
    }

    .menu-icon {
      margin: 0 auto;
      font-size: 24px;
    }

    .menu-title {
      text-align: center;
      font-size: 14px;
    }
  }
}

.has-logo {
  .scrollbar {
    height: calc(100% - $logo-height) !important;
  }
}
</style>
