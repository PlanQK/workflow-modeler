import BpmnRenderer from "bpmn-js/lib/draw/BpmnRenderer";
import * as consts from '../Constants';
import {drawDataStoreSVG, drawTaskSVG} from "../../../common/util/RenderUtilities";
import {getSVG} from "./DataFlowSVGMap";

export default class DataFlowRenderer extends BpmnRenderer {

    constructor(config, eventBus, styles, pathMap, canvas, textRenderer) {
        super(config, eventBus, styles, pathMap, canvas, textRenderer, 1001);

        // create handlers to render the data flow extension elements
        this.dataFlowHandler = {
            [consts.DATA_MAP_OBJECT]: function (self, parentGfx, element) {
                const task = self.renderer('bpmn:DataObject')(parentGfx, element);

                drawDataStoreSVG(parentGfx, getSVG(consts.DATA_TYPE_DATA_MAP_OBJECT));

                return task;
            },
            [consts.DATA_STORE_MAP]: function (self, parentGfx, element) {
                const task = self.renderer('bpmn:DataStoreReference')(parentGfx, element);

                drawDataStoreSVG(parentGfx, getSVG(consts.DATA_TYPE_DATA_STORE_MAP));

                return task;
            },
            [consts.TRANSFORMATION_TASK]: function (self, parentGfx, element) {
                const task = self.renderer('bpmn:Task')(parentGfx, element);

                drawTaskSVG(parentGfx, getSVG(consts.TASK_TYPE_TRANSFORMATION_TASK));

                return task;
            },
            [consts.TRANSFORMATION_ASSOCIATION]: function (self, parentGfx, element) {
                const flow = self.renderer('bpmn:DataOutputAssociation')(parentGfx, element);
                // var fill = getFillColor(element, defaultFillColor),
                //     stroke = getStrokeColor(element, defaultStrokeColor);
                //
                // const rules = self.getBpmnRules();
                //
                // const flow = self.renderer('bpmn:Association')(parentGfx, element, {
                //   markerEnd: rules.marker.call(this, 'association-end', fill, stroke)
                // });

                svgAttr(flow, {
                    stroke: 'red'
                });

                return flow;
            },
            [consts.INPUT_TRANSFORMATION_ASSOCIATION]: function (self, parentGfx, element) {
                const flow = self.renderer('bpmn:DataInputAssociation')(parentGfx, element);
                // var fill = getFillColor(element, defaultFillColor),
                //     stroke = getStrokeColor(element, defaultStrokeColor);
                //
                // const rules = self.getBpmnRules();
                //
                // const flow = self.renderer('bpmn:Association')(parentGfx, element, {
                //   markerEnd: rules.marker.call(this, 'association-end', fill, stroke)
                // });

                svgAttr(flow, {
                    // fill: 'none',
                    strokeDasharray: '15, 10', //width, space of the stroke
                    strokeLinecap: 'square',
                    // stroke: 'green',
                    // strokeWidth: 3
                });

                return flow;
            },
            [consts.OUTPUT_TRANSFORMATION_ASSOCIATION]: function (self, parentGfx, element) {
                const flow = self.renderer('bpmn:DataOutputAssociation')(parentGfx, element);
                // var fill = getFillColor(element, defaultFillColor),
                //     stroke = getStrokeColor(element, defaultStrokeColor);
                //
                // const rules = self.getBpmnRules();
                //
                // const flow = self.renderer('bpmn:Association')(parentGfx, element, {
                //   markerEnd: rules.marker.call(this, 'association-end', fill, stroke)
                // });

                svgAttr(flow, {
                    // fill: 'none',
                    strokeDasharray: '15, 10', //width, space of the stroke
                    strokeLinecap: 'square',
                    // stroke: 'green',
                    // strokeWidth: 3
                });

                return flow;
            }
        }
    }

    renderer(type) {
        return this.handlers[type];
    }

    canRender(element) {

        // render all elements which have a rendering handler
        return this.dataFlowHandler[element.type];
    }

    drawShape(parentNode, element) {

        // handle QuantME elements
        if (element.type in this.dataFlowHandler) {
            var h = this.dataFlowHandler[element.type];

            /* jshint -W040 */
            return h(this, parentNode, element);
        }
    }

    drawConnection(parentGfx, element) {

        console.log("Draw Connection of type " + element.type)

        if (element.type in this.dataFlowHandler) {
            let h = this.dataFlowHandler[element.type];
            return h(this, parentGfx, element);
        }

        // return super.drawConnection(parentGfx, element);
    }
}

DataFlowRenderer.$inject = [
    'config',
    'eventBus',
    'styles',
    'pathMap',
    'canvas',
    'textRenderer'
];