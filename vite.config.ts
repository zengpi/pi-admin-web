import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// Element Plus
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// vxe-table
import {
  createStyleImportPlugin,
  VxeTableResolve,
} from "vite-plugin-style-import";

// svg
import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

import vueSetupExtend from "vite-plugin-vue-setup-extend";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "0.0.0.0",
      open: true,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: "http://localhost:9317",
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(new RegExp("^" + env.VITE_APP_BASE_API), ""),
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      createSvgIconsPlugin({
        iconDirs: [
          path.resolve(process.cwd(), "src/assets/icons"),
          path.resolve(process.cwd(), "src/assets/icons/bpmn-icons"),
        ],
        symbolId: "icon-[dir]-[name]",
      }),
      vueSetupExtend(),
      createStyleImportPlugin({
        resolves: [VxeTableResolve()],
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        types: fileURLToPath(new URL("./types", import.meta.url)),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      },
    },
    build: {
      chunkSizeWarningLimit: 2500,
    },
  };
});
