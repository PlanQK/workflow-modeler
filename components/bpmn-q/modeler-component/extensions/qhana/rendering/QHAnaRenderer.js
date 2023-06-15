import BpmnRenderer from "bpmn-js/lib/draw/BpmnRenderer";
import * as consts from "../QHAnaConstants";
import { drawTaskSVG } from "../../../editor/util/RenderUtilities";
import { getSVG } from "./QHAnaSVGMap";

/**
 * Custom renderer for rendering the extension elements of the QHAna plugin.
 */
export default class QHAnaRenderer extends BpmnRenderer {
  constructor(config, eventBus, styles, pathMap, canvas, textRenderer) {
    super(config, eventBus, styles, pathMap, canvas, textRenderer, 1001);

    // create handlers to render the  QHAna extension elements
    this.qhanaHandler = {
      [consts.QHANA_SERVICE_TASK]: function (self, parentGfx, element) {
        const task = self.renderer("bpmn:Task")(parentGfx, element);

        drawTaskSVG(parentGfx, getSVG(consts.TASK_TYPE_QHANA_SERVICE_TASK));

        return task;
      },
      [consts.QHANA_SERVICE_STEP_TASK]: function (self, parentGfx, element) {
        const task = self.renderer("bpmn:Task")(parentGfx, element);

        drawTaskSVG(
          parentGfx,
          getSVG(consts.TASK_TYPE_QHANA_SERVICE_STEP_TASK)
        );

        return task;
      },
    };
  }

  renderer(type) {
    return this.handlers[type];
  }

  canRender(element) {
    // only return true if handler for rendering is registered
    return this.qhanaHandler[element.type];
  }

  drawShape(parentNode, element) {
    // handle QHAna elements
    if (element.type in this.qhanaHandler) {
      const h = this.qhanaHandler[element.type];

      /* jshint -W040 */
      return h(this, parentNode, element);
    }
  }
}

QHAnaRenderer.$inject = [
  "config",
  "eventBus",
  "styles",
  "pathMap",
  "canvas",
  "textRenderer",
];
