import BpmnRenderer from "bpmn-js/lib/draw/BpmnRenderer";

import * as consts from "../Constants";
import { getBlockMESVG } from "./BlockMESVGMap";
import { drawDataElementSVG, drawTaskSVG } from "../../../editor/util/RenderUtilities";

const HIGH_PRIORITY = 14001;

export default class BlockMERenderer extends BpmnRenderer {
  constructor(config, eventBus, styles, pathMap, canvas, textRenderer) {
    super(
      config,
      eventBus,
      styles,
      pathMap,
      canvas,
      textRenderer,
      HIGH_PRIORITY
    );

    // define render functions for blockme extension elements
    this.blockmeHandlers = {
      [consts.BLOCKME_INVOKE_SC_FUNCTION_TASK]: function(self, parentGfx, element) {
        const task = self.renderer("bpmn:Task")(parentGfx, element);
        drawTaskSVG(parentGfx, getBlockMESVG("TASK_TYPE_INVOKE_SC_FUNCTION"));

        return task;
      },
      [consts.BLOCKME_SEND_TX_TASK]: function(self, parentGfx, element) {
        const task = self.renderer("bpmn:Task")(parentGfx, element);
        drawDataElementSVG(parentGfx, getBlockMESVG("TASK_TYPE_SEND_TX"));

        return task;
      },
      [consts.BLOCKME_RECEIVE_TX_TASK]: function(self, parentGfx, element) {
        const task = self.renderer("bpmn:Task")(parentGfx, element);
        drawDataElementSVG(parentGfx, getBlockMESVG("TASK_TYPE_RECEIVE_TX"));

        return task;
      },
      [consts.BLOCKME_ENSURE_TX_STATE_TASK]: function(self, parentGfx, element) {
        const task = self.renderer("bpmn:Task")(parentGfx, element);
        drawDataElementSVG(parentGfx, getBlockMESVG("TASK_TYPE_ENSURE_TX_STATE"));

        return task;
      }
    };
  }

  renderer(type) {
    return this.handlers[type];
  }

  canRender(element) {
    // only return true if handler for rendering is registered
    return this.blockmeHandlers[element.type];
  }

  drawShape(parentNode, element) {
    if (element.type in this.blockmeHandlers) {
      const h = this.blockmeHandlers[element.type];

      return h(this, parentNode, element);
    }
  }

  getShapePath(shape) {
    return super.getShapePath(shape);
  }
}

BlockMERenderer.$inject = [
  "config",
  "eventBus",
  "styles",
  "pathMap",
  "canvas",
  "textRenderer"
];
