import {
    getRoundRectPath
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
    is,
} from 'bpmn-js/lib/util/ModelUtil';

import BpmnRenderer from "bpmn-js/lib/draw/BpmnRenderer";

import * as consts from './utilities/Constants';
import {getSVG} from "./SVGMap";
import {drawDataElementSVG, drawTaskSVG} from "../../editor/util/RenderUtilities";

const HIGH_PRIORITY = 14001,
    TASK_BORDER_RADIUS = 2;

export default class PlanQKRenderer extends BpmnRenderer {
    constructor(config, eventBus, styles, pathMap, canvas, textRenderer) {
        super(config, eventBus, styles, pathMap, canvas, textRenderer, HIGH_PRIORITY);

        // define render functions for planqk extension elements
        this.planqkHandlers = {
            [consts.PLANQK_SERVICE_TASK]: function (self, parentGfx, element) {
                const task = self.renderer('bpmn:Task')(parentGfx, element);
                drawTaskSVG(parentGfx, getSVG('TASK_TYPE_PLANQK_SERVICE_TASK'));

                return task;
            },
            [consts.PLANQK_DATA_POOL]: function (self, parentGfx, element) {
                const store = self.renderer('bpmn:DataStoreReference')(parentGfx, element);
                drawDataElementSVG(parentGfx, getSVG('DATA_TYPE_DATA_POOL'));

                return store;
            },
        };
    }

    renderer(type) {
        return this.handlers[type];
    }

    canRender(element) {

        // only return true if handler for rendering is registered
        return this.planqkHandlers[element.type];
    }

    drawShape(parentNode, element) {

        if (element.type in this.planqkHandlers) {
            const h = this.planqkHandlers[element.type];

            return h(this, parentNode, element);
        }
    }

    getShapePath(shape) {
        if (is(shape, consts.PLANQK_SERVICE_TASK)) {
            return getRoundRectPath(shape, TASK_BORDER_RADIUS);
        }

        return super.getShapePath(shape);
    }
}

PlanQKRenderer.$inject = [
    'config',
    'eventBus',
    'styles',
    'pathMap',
    'canvas',
    'textRenderer'
];



