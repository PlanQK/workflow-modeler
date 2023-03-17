import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate, innerSVG,
  select as svgSelect
} from 'tiny-svg';

import {
  getFillColor,
  getRoundRectPath, getStrokeColor
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
  is,
} from 'bpmn-js/lib/util/ModelUtil';

import BpmnRenderer from "bpmn-js/lib/draw/BpmnRenderer";

import * as consts from './utilities/Constants';
import {getSVG} from "./SVGMap";

const HIGH_PRIORITY = 1500,
    TASK_BORDER_RADIUS = 2;


export default class ServiceTaskRenderer extends BpmnRenderer {
  constructor(config, eventBus, styles, pathMap, canvas, textRenderer) {
    super(config, eventBus, styles, pathMap, canvas, textRenderer, HIGH_PRIORITY);

    function drawPath(parentGfx, d, attrs) {

      const path = svgCreate('path');
      svgAttr(path, { d: d });
      svgAttr(path, attrs);

      svgAppend(parentGfx, path);

      return path;
    }

    function drawTaskSVG(parentGfx, iconID) {
      var importsvg = getSVG(iconID);
      var innerSVGstring = importsvg.svg;
      var transformDef = importsvg.transform;

      const groupDef = svgCreate('g');
      svgAttr(groupDef, { transform: transformDef });
      innerSVG(groupDef, innerSVGstring);

      // set task box opacity to 0 such that icon can be in the background
      svgAttr(svgSelect(parentGfx, 'rect'), { 'fill-opacity': 0 });

      // draw svg in the background
      parentGfx.prepend(groupDef);
    }

    function drawDataStoreSVG(parentGfx, iconID) {
      var importsvg = getSVG(iconID);
      var innerSVGstring = importsvg.svg;
      var transformDef = importsvg.transform;

      const groupDef = svgCreate('g');
      svgAttr(groupDef, { transform: transformDef });
      innerSVG(groupDef, innerSVGstring);

      // draw svg in the background
      parentGfx.append(groupDef);
    }

    this.planqkHandlers = {
      [consts.PLANQK_SERVICE_TASK]: function(self, parentGfx, element) {
        const task = self.renderer('bpmn:Task')(parentGfx, element);
        drawTaskSVG(parentGfx, 'TASK_TYPE_PLANQK_SERVICE_TASK');

        return task;
      },
      [consts.PLANQK_DATA_POOL]: function(self, parentGfx, element) {
        const store = self.renderer('bpmn:DataStoreReference')(parentGfx, element);
        drawDataStoreSVG(parentGfx, 'DATA_TYPE_DATA_POOL');

        return store;
      },
    }

  }

  renderer(type) {
    return this.handlers[type];
  }


  canRender(element) {

    // ignore labels
    return !element.labelTarget;
  }

  drawShape(parentNode, element) {

    if (element.type in this.planqkHandlers) {
      var h = this.planqkHandlers[element.type];

      /* jshint -W040 */
      return h(this, parentNode, element);
    }
  }

  getShapePath(shape) {
    if (is(shape, 'planqk:ServiceTask')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS);
    }

    return super.getShapePath(shape);
  }


}

ServiceTaskRenderer.$inject = [
    'config',
  'eventBus',
  'styles',
  'pathMap',
  'canvas',
  'textRenderer' ];

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, color) {
  const rect = svgCreate('rect');

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: color,
    strokeWidth: 2,
    fill: color
  });

  svgAppend(parentNode, rect);

  return rect;
}
