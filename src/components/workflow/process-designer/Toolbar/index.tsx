import { defineComponent } from "vue";

import { ElButtonGroup } from "element-plus";

import Saves from "@/components/workflow/process-designer/Toolbar/components/Saves";
import Imports from "@/components/workflow/process-designer/Toolbar/components/Imports";
import Exports from "@/components/workflow/process-designer/Toolbar/components/Exports";
import Previews from "@/components/workflow/process-designer/Toolbar/components/Previews";
import Aligns from "@/components/workflow/process-designer/Toolbar/components/Aligns";
import Scales from "@/components/workflow/process-designer/Toolbar/components/Scales";
import Commands from "@/components/workflow/process-designer/Toolbar/components/Commands";
import ExternalTools from "@/components/workflow/process-designer/Toolbar/components/ExternalTools";

const Toolbar = defineComponent({
  name: "ToolBar",
  setup() {
    return () => (
      <div class="toolbar">
        <ElButtonGroup>
          <Saves></Saves>
          <Imports></Imports>
          <Exports></Exports>
          <Previews></Previews>
        </ElButtonGroup>
        <Aligns></Aligns>
        <Scales></Scales>
        <Commands></Commands>
        <ExternalTools></ExternalTools>
      </div>
    );
  },
});

export default Toolbar;
