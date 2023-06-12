<script setup name="TenantPackage" lang="ts">
import { ref, computed, watch } from "vue";

import { ElMessage } from "element-plus";

import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import { ComponentProps } from "@/model";

import {
  getMenuIdsByPackageId,
  allocatePackageMenu,
} from "@/api/system/package";

import { getLoading } from "@/util/element-plus";

import Package from "./Package.vue";
import MenuAllocation from "@/views/system/menu/MenuAllocation.vue";

const componentProps = ref(new ComponentProps());

const menuIds = ref<number[]>([]);

const packageId = computed(() => componentProps.value.id);

watch(packageId, () => {
  loadMenuIdsByPackageId();
});

/**
 * 根据 packageId 获取菜单 ID
 */
const loadMenuIdsByPackageId = () => {
  getMenuIdsByPackageId(packageId.value).then(({ data }) => {
    menuIds.value = data;
  });
};

async function handleSubmit(menuIds: number[]) {
  let loading = getLoading();
  allocatePackageMenu(packageId.value, menuIds)
    .then(() => {
      loading.close();
      ElMessage.success("提交成功");
    })
    .catch(() => {
      loading.close();
    });
}
</script>

<template>
  <div class="fixed-app-container">
    <Splitpanes class="default-theme">
      <Pane size="60" min-size="50" max-size="70" style="padding-right: 10px">
        <Package v-model:component-props="componentProps" />
      </Pane>
      <Pane>
        <div class="menu-allocation-container">
          <el-scrollbar wrapClass="scrollbar-wrapper">
            <MenuAllocation
              :component-props="componentProps"
              :menu-ids="menuIds"
              @submit="handleSubmit"
            />
          </el-scrollbar>
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>

<style lang="scss" scoped>
.menu-allocation-container {
  height: calc(100% - 20px);
  padding: 10px;
}
</style>
