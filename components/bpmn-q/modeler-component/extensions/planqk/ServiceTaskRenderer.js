import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg';

import {
  getFillColor,
  getRoundRectPath, getStrokeColor
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
  is,
} from 'bpmn-js/lib/util/ModelUtil';

import BpmnRenderer from "bpmn-js/lib/draw/BpmnRenderer";

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

    this.planqkHandlers = {
      ["planqk:ServiceTask"]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);

        var pathDataBG = pathMap.getScaledPath('TASK_TYPE_SERVICE', {
          abspos: {
            x: 12,
            y: 18
          }
        });

       drawPath(parentGfx, pathDataBG, {
          strokeWidth: 1,
          fill: getFillColor(element, 'white'),
          stroke: getStrokeColor(element, 'black')
        });

        return task;
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

    // use parent class for all non QuantME elements
    return super.drawShape(parentNode, element);
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
