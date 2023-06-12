import { shallowRef, ref } from "vue";
import { defineStore } from "pinia";
import type { RouteRecordRaw } from "vue-router";

import { localRouters } from "@/router";

import { buildMenu } from "@/api/system/menu";

import Navigation from "@/views/layout/Index.vue";
import ParentView from "@/components/ParentView.vue";

const components = import.meta.glob("../views/**/*.vue");

const useRouterStore = defineStore("router", () => {
  /**
   * 数据库中动态获取的菜单
   */
  const dynamicRouters = shallowRef<Array<RouteRecordRaw>>([]);
  /**
   * 所有菜单
   */
  const routers = shallowRef<Array<RouteRecordRaw>>([]);
  /**
   * 扁平后的菜单
   */
  const flatRoutes = shallowRef<Array<RouteRecordRaw>>([]);
  /**
   * 激活的主导航菜单项索引
   */
  const activedMainSidebarMenuItem = ref(0);

  /**
   * 生成菜单
   * @returns /
   */
  function generateRouters() {
    return new Promise((resolve, reject) => {
      buildMenu()
        .then(({ data }) => {
          let tempMenus = data;
          if (!tempMenus) {
            tempMenus = [];
          }
          const sourceData = JSON.parse(JSON.stringify(tempMenus));
          const sourceFlatRouters = genFlatRouters(sourceData as any[]);
          flatRoutes.value = handleDynamicRoute(sourceFlatRouters as any[]);

          dynamicRouters.value = handleDynamicRoute(tempMenus as any[]);
          routers.value = localRouters.concat(dynamicRouters.value);

          resolve(flatRoutes.value);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 设置激活的主导航菜单项索引
   */
  function setActivedMainSidebarMenuItem(location: number | string) {
    if (typeof location === "number") {
      activedMainSidebarMenuItem.value = location >= 0 ? location : 0;
      return;
    }

    const index = dynamicRouters.value.findIndex((item) =>
      location.startsWith(item.path)
    );
    activedMainSidebarMenuItem.value = index >= 0 ? index : 0;
  }

  return {
    routers,
    dynamicRouters,
    activedMainSidebarMenuItem,
    generateRouters,
    setActivedMainSidebarMenuItem,
  };
});

function handleDynamicRoute(routers: RouteRecordRaw[]) {
  const rstRouters: RouteRecordRaw[] = [];

  routers.forEach((router) => {
    const tempRouter: RouteRecordRaw = { ...router };
    if ((tempRouter.component as any) === "Navigation") {
      tempRouter.component = Navigation;
    } else if ((tempRouter.component as any) === "ParentView") {
      tempRouter.component = ParentView;
    } else {
      const component = components[
        `../views/${tempRouter.component}.vue`
      ] as any;
      tempRouter.component = component
        ? component
        : () => import("@/components/error-page/404.vue");
    }
    rstRouters.push(tempRouter);

    if (tempRouter.children) {
      tempRouter.children = handleDynamicRoute(tempRouter.children);
    }
  });
  return rstRouters;
}

function genFlatRouters(routers: RouteRecordRaw[]): RouteRecordRaw[] {
  return routers.filter((router) => {
    if (router.children && router.children.length) {
      router.children = handleFlatRouters(router.children);
    }
    return true;
  });
}

function handleFlatRouters(routers: any[], lastRouter?: any): any[] {
  let flatRouters: any[] = [];

  routers.forEach((router) => {
    if (router.children && router.children.length) {
      if (router.component === "ParentView" && !lastRouter) {
        router.children.forEach((children) => {
          children.path = router.path + "/" + children.path;
          if (children.children && children.children.length) {
            flatRouters = flatRouters.concat(
              handleFlatRouters(children.children, children)
            );
            return;
          }
          flatRouters.push(children);
        });
        return;
      }
    }
    if (lastRouter) {
      router.path = lastRouter.path + "/" + router.path;
    }
    flatRouters = flatRouters.concat(router);
  });
  return flatRouters;
}

export default useRouterStore;
