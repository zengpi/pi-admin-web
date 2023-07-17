<script setup lang="ts" name="ProcessViewer">
/**
 * 流程查看器
 *
 * @author ZnPi
 * @date 2023-03-31
 */
import { ref, onMounted, nextTick } from "vue";

import { ElMessage } from "element-plus";
import { ZoomOut, ZoomIn } from "@element-plus/icons-vue";

import "@/assets/styles/bpmn-js/index.scss";
import Viewer from "bpmn-js/lib/Viewer";
import MoveCanvas from "diagram-js/lib/navigation/movecanvas";

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
} from "tiny-svg";

import { query as domQuery } from "min-dom";

import type {
  ProcessInstanceLog,
  ViewerElement,
} from "@/model/process/process-center/process-instance";

const props = defineProps<{
  bpmnXml: string;
  logs?: ProcessInstanceLog[];
  viewerElement?: ViewerElement;
}>();

const viewer = ref<Viewer>();
const canvas = ref<HTMLElement>();
const zoomValue = ref(100);

const overlayId = ref<string>();

const popover = ref();

const businessObjectName = ref("");

const isHover = ref(false);

const taskDetails = ref();

onMounted(() => {
  importXml(props.bpmnXml);
});

async function importXml(bpmnXml: string) {
  if (!bpmnXml) {
    return;
  }
  try {
    // BPMN viewer instance
    viewer.value = new Viewer({
      additionalModules: [
        // 移动画布
        MoveCanvas,
      ],
      container: canvas.value,
    });
    await viewer.value.importXML(bpmnXml);
    addMarkers();
    (viewer.value as any).get("canvas").zoom("fit-viewport", "auto");
    await nextTick();
    setProcessElementStatus();

    var overlays: any = viewer.value.get("overlays");

    const eventBus: any = viewer.value.get("eventBus");
    const eventTypes = ["element.click", "element.hover"];
    eventTypes.forEach((eventType) => {
      eventBus.on(eventType, async (e: any) => {
        if (overlayId.value) {
          isHover.value = false;
          overlays.remove(overlayId.value);
        }
        const { element } = e;
        if (!element || !element.parent) return;

        const black: string[] = [
          "bpmn:SequenceFlow",
          "bpmn:Process",
          "bpmn:EndEvent",
        ];
        if (black.includes(element.type)) {
          return;
        } else {
          if (eventType === "element.click") {
            console.debug("click event");
          } else if (eventType === "element.hover") {
            if (!props.logs) {
              return;
            }
            businessObjectName.value = element.businessObject.name;

            taskDetails.value = props.logs.filter(
              (log) => log.activityId === element.id
            );

            if (taskDetails.value.length === 0) {
              return;
            }

            isHover.value = true;
            await nextTick();
            overlayId.value = overlays.add(element.id, {
              position: {
                bottom: -10,
                left: 0,
              },
              html: popover.value,
            });
          }
        }
      });
    });
  } catch (err) {
    ElMessage.error((err as any).toString());
  }
}

/**
 * 设置流程元素状态
 */
function setProcessElementStatus() {
  if (!viewer.value || !props.viewerElement) return;
  const { finishedTasks, finishedSequenceFlows, todoTasks, rejectedTasks } =
    props.viewerElement;
  const canvas: any = viewer.value!.get("canvas");
  const elementRegistry: any = viewer.value!.get("elementRegistry");

  if (Array.isArray(finishedSequenceFlows)) {
    finishedSequenceFlows.forEach((item) => {
      if (item != null) {
        canvas.addMarker(item, "success");
        let element = elementRegistry.get(item);
        const conditionExpression = element.businessObject.conditionExpression;
        if (conditionExpression) {
          canvas.addMarker(item, "condition-expression");
        }
      }
    });
  }
  if (Array.isArray(finishedTasks)) {
    finishedTasks.forEach((item) => canvas.addMarker(item, "success"));
  }
  if (Array.isArray(todoTasks)) {
    todoTasks.forEach((item) => canvas.addMarker(item, "primary"));
  }
  if (Array.isArray(rejectedTasks)) {
    rejectedTasks.forEach((item) => {
      if (item != null) {
        let element = elementRegistry.get(item);
        if (element.type.includes("Task")) {
          canvas.addMarker(item, "danger");
        } else {
          canvas.addMarker(item, "warning");
        }
      }
    });
  }
}

/**
 * 添加 Markers
 */
function addMarkers() {
  doAddMarkers("sequenceflow-arrow-success", "var(--el-color-success)");
  doAddMarkers("conditional-flow-arrow-success", "var(--el-color-success)");
  doAddMarkers("sequenceflow-arrow-fail", "var(--el-color-warning)");
  doAddMarkers("conditional-flow-arrow-fail", "var(--el-color-warning)");
}

function doAddMarkers(id: string, color: string) {
  const marker = svgCreate("marker");

  svgAttr(marker, {
    id: id,
    viewBox: "0 0 20 20",
    refX: "11",
    refY: "10",
    markerWidth: "10",
    markerHeight: "10",
    orient: "auto",
  });

  const path = svgCreate("path");

  svgAttr(path, {
    d: "M 1 5 L 11 10 L 1 15 Z",
    style: `stroke-linecap: round; stroke-linejoin: round; stroke: ${color}; stroke-width: 1px; fill: ${color}`,
  });

  const defs: any = domQuery("defs");
  svgAppend(marker, path);
  svgAppend(defs, marker);
}

function handleZoomIn(zoomStep = 10) {
  zoomValue.value += zoomStep;
  if (viewer.value) {
    (viewer.value.get("canvas") as any).zoom(zoomValue.value / 100);
  }
}
function handleZoomOut(zoomStep = 10) {
  zoomValue.value -= zoomStep;
  if (viewer.value) {
    (viewer.value.get("canvas") as any).zoom(zoomValue.value / 100);
  }
}
function handleReZoom() {
  zoomValue.value = 100;
  if (viewer.value) {
    (viewer.value.get("canvas") as any).zoom("fit-viewport", "auto");
  }
}
</script>

<template>
  <div class="process-viewer">
    <div ref="canvas" class="canvas"></div>

    <div ref="popover" v-show="isHover" style="width: 1000px">
      <el-table :data="taskDetails" border>
        <el-table-column
          label="序号"
          header-align="center"
          align="center"
          type="index"
          width="70px"
        />
        <el-table-column
          label="候选办理"
          prop="candidate"
          width="150px"
          align="center"
        />
        <el-table-column
          label="实际办理"
          prop="assigneeName"
          width="120px"
          align="center"
        />
        <el-table-column
          label="处理时间"
          prop="startTime"
          width="180px"
          align="center"
        />
        <el-table-column
          label="办结时间"
          prop="endTime"
          width="180px"
          align="center"
        />
        <el-table-column
          label="耗时"
          prop="duration"
          width="170px"
          align="center"
        />
        <el-table-column label="审批意见" align="center" #default="{ row }">
          {{
            row.comments && row.comments[0] ? row.comments[0].fullMessage : ""
          }}
        </el-table-column>
      </el-table>
    </div>

    <div class="zoom-container">
      <el-row justify="end" type="flex">
        <el-button-group>
          <el-button
            :icon="ZoomOut"
            :disabled="zoomValue <= 30"
            @click="handleZoomOut()"
          />
          <el-button style="width: 90px" @click="handleReZoom()">{{
            zoomValue + "%"
          }}</el-button>
          <el-button
            :icon="ZoomIn"
            :disabled="zoomValue >= 200"
            @click="handleZoomIn()"
          />
        </el-button-group>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.zoom-container {
  position: absolute;
  width: 100%;
  top: 0px;
  left: 0px;
}
</style>
