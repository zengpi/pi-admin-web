# pi-cloud-web

## 简介

pi-admin-web 是 pi-admin 的前端源码，它是基于 Vue 3、Vite、Typescript、Pinia、ElementPlus 等前端主流技术栈构建的。

## 特性

- 使用基于 [Vite](https://cn.vitejs.dev/) 的构建设置进行 [Vue 3](https://cn.vuejs.org/) 开发
- 页面基于 [ElementPlus](https://element-plus.org/zh-CN/) 构建
- 使用 [Pinia](https://pinia.vuejs.org/zh/) 进行状态管理
- 国际化、按钮权限、ElementPlus 自定义主题
- 使用 [Typescript](https://www.typescriptlang.org/zh/)，类型更安全
- 集成 [bpmn.js](https://gitee.com/MiyueSC/vite-vue-bpmn-process) 与 [Vite Vue Bpmn Process Editor](https://gitee.com/MiyueSC/vite-vue-bpmn-process)，简化工作流流程设计
- 整合 [vxe-table](https://vxetable.cn/#/table/start/install)，适应更复杂的表格处理场景

## 系统演示

系统演示请访问：https://jiabin.williamalec.top/

## 源码

|      | Gitee                                           | GitHub                                     |
| ---- | ----------------------------------------------- | ------------------------------------------ |
| 后端 | https://gitee.com/linjiabin100/pi-admin.git     | https://github.com/zengpi/pi-admin.git     |
| 前端 | https://gitee.com/linjiabin100/pi-admin-web.git | https://github.com/zengpi/pi-admin-web.git |

### 分支说明

**master**：主分支。最新代码的稳定分支。

**1.x**：1.0 版本稳定分支。

**dev**：开发分支。此分支代码随时修改，不稳定。

### 版本说明

pi-admin-web 的版本号命名方式为 主版本号.次版本号.修订号：

- 主版本号 - 版本可能包含破坏性更改，如产品方向改变，或者大规模 API 不兼容，或者架构不兼容升级。
- 次版本号 - 保持相对兼容性，包含增强功能，影响范围极小的 API 不兼容修改。
- 修订号 - 版本完全向前和向后兼容，bug 修复、新增次要功能特性等。

**注意：SNAPSHOT 版本是一种特殊的版本命名约定，用于表示软件项目的开发过程中的临时版本或快照版本。SNAPSHOT 版本用于开发和测试阶段，通常不适合用于生产环境或稳定版本的部署，可能包含未经完全验证或不稳定的代码。**

## 参考文档

请阅读 pi-admin-web 的 [参考文档](https://gitee.com/linjiabin100/pi-cloud-web/wikis/pages) ，它描述了开发、运行 pi-admin-web 的必要信息以及核心原理。

阅读 [个人博客](https://gitee.com/link?target=https%3A%2F%2Fwww.cnblogs.com%2Fzn-pi%2F) 也是一个不错的选择，它是对文档很好的一个补充，阅读它会对项目有更深的理解。

## 功能模块

```
- 系统
   - 用户管理                       维护平台、租户用户
   - 菜单管理                       维护系统菜单、按钮等，配置按钮权限标识。另外，租户用户只能查看菜单，无法新增或修改菜单
   - 角色管理                       维护系统角色，为角色分配菜单权限
   - 部门管理                       维护系统组织架构（公司、部门、组织）、数据权限等
   - 操作日志                       查看系统操作日志
   - 接口文档                       系统 API 接口文档
- 流程
   - 流程管理
      - 流程分类                    管理流程分类
      - 表单配置                    维护流程节点表单，用于收集流程数据
      - 流程建模                    bpmn 设计器，在线设计流程模型
      - 流程部署                    对流程模型进行部署
   - 流程中心
      - 新建流程                    根据流程定义创建流程实例
      - 我的流程                    查看登录用户的流程实例
      - 代办任务                    查看登录用户代办的任务
      - 抄送我的                    查看抄送给登录用户的流程
      - 已办任务                    查看登录用户已办的历史任务
- 租户
   - 企业管理                       管理企业信息，用户根据企业信息新增租户，一个企业对应一个租户。
   - 套餐管理                       维护租户所拥有的的菜单。
   - 租户管理                       维护租户信息，设置租户套餐，用户数量等。
```

## 快速开始

### 运行环境  

要在你的机器上开发运行 pi-admin-web，你需要 node.js 16.0 + 版本，推荐使用 16.0.0。推荐的 IDE 是 [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (并且禁用 Vetur) 。
TypeScript 不能处理 .vue 的类型信息。所以我们用 vue-tsc 替换 tsc CLI 来进行类型检查。在编辑器中，我们需要 [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) 来让 TypeScript语言服务识别 .vue 的类型。
如果你觉得独立的 TypeScript 插件不够快，Volar 还实现了一个性能更好的[接管模式](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669)。您可以通过查看[此文档](https://cn.vuejs.org/guide/typescript/overview.html#volar-takeover-mode)开启。

#### nvm-windows

nvm-windows 用于在 Windows 中管理 node.js 的多个版本安装。安装程序请点击 [此处](https://github.com/coreybutler/nvm-windows/releases) 下载，具体使用方式请参考 [官方文档](https://github.com/coreybutler/nvm-windows)。以下是常用操作：

```shell
# 设置 node 国内镜像
$ nvm node_mirror https://npmmirror.com/mirrors/node/
# 设置 npm 国内镜像
$ nvm npm_mirror https://npmmirror.com/mirrors/npm/
# 安装指定 <version> 的 node.js
$ nvm install <version>
# 查看已安装的 node.js
$ nvm list
# 切换到指定 <version> 的 node.js
$ nvm use <version>
```

### 项目下载

```shell
$ git clone https://gitee.com/linjiabin100/pi-admin-web.git
# or
$ git clone https://github.com/zengpi/pi-admin-web.git
```

### 项目启动

```bash
# Project Setup
npm install
# Compile and Hot-Reload for Development
npm run dev
# Lint with [ESLint](https://eslint.org/)
npm run lint
# Type-Check, Compile and Minify for Production
npm run build
# Preview the build
npm run preview
```

**<font style="color: red;">注意：由于在 pi-admin 中 Element Plus 是按需导入的，当您第一次运行代码并打开系统页面时会出现短暂的卡顿，这是由于动态导入组件导致的。</font>**

## 预览

| ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610200702.png) | ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610200729.png) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610200743.png) | ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610200755.png) |
| ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610200810.png) | ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610200824.png) |
| ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/2023-06-26/20230628095614.png) | ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610200848.png) |
| ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610201007.png) | ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610201029.png) |
| ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610201053.png) | ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610201111.png) |
| ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610201135.png) | ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610201151.png) |
| ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610201210.png) | ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610201225.png) |
| ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610201236.png) | ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610201249.png) |
| ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610201307.png) | ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610201326.png) |
| ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610201339.png) | ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610201351.png) |
| ![](https://cdn.jsdelivr.net/gh/zengpi/image-hosting-service/pi-admin/20230610201405.png) |                                                              |
