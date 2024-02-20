import BpmnRenderer from "bpmn-js/lib/draw/BpmnRenderer";
import * as consts from "../Constants";
import { attr as svgAttr } from "tiny-svg";
import {
  drawDataElementSVG,
  drawTaskSVG,
} from "../../../editor/util/RenderUtilities";
import { getSVG } from "./DataFlowSVGMap";
import { extractConfigSVG } from "../../../editor/configurations/ConfigurationsUtil";

/**
 * Custom renderer for the DataFlow elements. Extends the BpmnRenderer of bpmn-js.
 */
export default class DataFlowRenderer extends BpmnRenderer {
  constructor(config, eventBus, styles, pathMap, canvas, textRenderer) {
    super(config, eventBus, styles, pathMap, canvas, textRenderer, 1001);

    // create handlers to render the data flow extension elements
    this.dataFlowHandler = {
      [consts.DATA_MAP_OBJECT]: function (self, parentGfx, element) {
        const task = self.renderer("bpmn:DataObject")(parentGfx, element);

        let svg =
          extractConfigSVG(element) || getSVG(consts.DATA_TYPE_DATA_MAP_OBJECT);
        drawDataElementSVG(parentGfx, svg);

        return task;
      },
      [consts.DATA_STORE_MAP]: function (self, parentGfx, element) {
        const task = self.renderer("bpmn:DataStoreReference")(
          parentGfx,
          element
        );

        let svg =
          extractConfigSVG(element) || getSVG(consts.DATA_TYPE_DATA_STORE_MAP);
        drawDataElementSVG(parentGfx, svg);

        return task;
      },
      [consts.TRANSFORMATION_TASK]: function (self, parentGfx, element) {
        const task = self.renderer("bpmn:Task")(parentGfx, element);

        let svg =
          extractConfigSVG(element) ||
          getSVG(consts.TASK_TYPE_TRANSFORMATION_TASK);
        drawTaskSVG(parentGfx, svg);

        return task;
      },
      [consts.TRANSFORMATION_ASSOCIATION]: function (self, parentGfx, element) {
        const flow = self.renderer("bpmn:DataOutputAssociation")(
          parentGfx,
          element
        );

        svgAttr(flow, {
          strokeDasharray: "15, 10", //width, space of the stroke
          strokeLinecap: "square",
        });

        return flow;
      },
      [consts.INPUT_TRANSFORMATION_ASSOCIATION]: function (
        self,
        parentGfx,
        element
      ) {
        const flow = self.renderer("bpmn:DataInputAssociation")(
          parentGfx,
          element
        );

        svgAttr(flow, {
          strokeDasharray: "15, 10", //width, space of the stroke
          strokeLinecap: "square",
        });

        return flow;
      },
      [consts.OUTPUT_TRANSFORMATION_ASSOCIATION]: function (
        self,
        parentGfx,
        element
      ) {
        const flow = self.renderer("bpmn:DataOutputAssociation")(
          parentGfx,
          element
        );

        svgAttr(flow, {
          strokeDasharray: "15, 10", //width, space of the stroke
          strokeLinecap: "square",
        });

        return flow;
      },
    };
  }

  renderer(type) {
    return this.handlers[type];
  }

  canRender(element) {
    // only return true if handler for rendering is registered
    return this.dataFlowHandler[element.type];
  }

  /**
   * Draw new shape for the given element based on its type.
   *
   * @param parentNode Parent of the given element
   * @param element The given element
   * @returns {*}
   */
  drawShape(parentNode, element) {
    console.log("Draw Shape of type " + element.type);

    // handle DataFlow elements
    if (element.type in this.dataFlowHandler) {
      const h = this.dataFlowHandler[element.type];

      /* jshint -W040 */
      return h(this, parentNode, element);
    }
  }

  /**
   * Draw new connection for the given connection element.
   *
   * @param parentGfx Parent of the given element
   * @param connectionElement The given connection element
   * @returns {*}
   */
  drawConnection(parentGfx, connectionElement) {
    console.log("Draw Connection of type " + connectionElement.type);

    if (connectionElement.type in this.dataFlowHandler) {
      let h = this.dataFlowHandler[connectionElement.type];
      return h(this, parentGfx, connectionElement);
    }

    return super.drawConnection(parentGfx, connectionElement);
  }
}

DataFlowRenderer.$inject = [
  "config",
  "eventBus",
  "styles",
  "pathMap",
  "canvas",
  "textRenderer",
];
