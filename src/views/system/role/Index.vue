<script setup name="SystemRole" lang="ts">
import { computed, ref, watch } from "vue";

import { ElMessage } from "element-plus";

import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import { ComponentProps } from "@/model";

import { allocateRoleMenu, getMenuIdsByRoleId } from "@/api/system/role";

import { getLoading } from "@/util/element-plus";

import Role from "./Role.vue";
import RoleMember from "./RoleMember.vue";
import MenuAllocation from "@/views/system/menu/MenuAllocation.vue";

const componentProps = ref(new ComponentProps());

const menuIds = ref<number[]>([]);

const roleId = computed(() => componentProps.value.id);

watch(roleId, () => {
  loadMenuIdsByRoleId();
});

/**
 * 根据 RoleId 获取菜单 ID
 */
const loadMenuIdsByRoleId = () => {
  getMenuIdsByRoleId(roleId.value!).then(({ data }) => {
    menuIds.value = data;
  });
};

async function handleSubmit(menuIds: number[]) {
  let loading = getLoading();
  console.log(menuIds);
  allocateRoleMenu(roleId.value, menuIds)
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
        <Role v-model:component-props="componentProps" />
      </Pane>
      <Pane>
        <el-tabs tab-position="top" class="tabs-container">
          <el-tab-pane label="角色成员">
            <RoleMember :component-props="componentProps" />
          </el-tab-pane>
          <el-tab-pane label="菜单分配" class="menu-allocation-container">
            <el-scrollbar wrapClass="scrollbar-wrapper">
              <MenuAllocation
                :component-props="componentProps"
                :menu-ids="menuIds"
                @submit="handleSubmit"
              />
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </Pane>
    </Splitpanes>
  </div>
</template>

<style lang="scss" scoped>
.menu-allocation-container {
  height: calc(100vh - 162px);
}
</style>
