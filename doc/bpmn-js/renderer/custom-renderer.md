# Custom Renderer for bpmn-js

```javascript
/**
 * Copyright (c) 2021 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';
import * as quantmeReplaceOptions from './QuantMEReplaceOptions';
import * as consts from '../Constants';
import { append as svgAppend, attr as svgAttr, create as svgCreate } from 'tiny-svg';
import { getFillColor, getStrokeColor } from 'bpmn-js/lib/draw/BpmnRenderUtil';

/**
 * This class extends the default BPMNRenderer to render the newly introduced QuantME task types
 */
export default class QuantMERenderer extends BpmnRenderer {
  constructor(config, eventBus, styles, pathMap, quantMEPathMap, canvas, textRenderer) {
    super(config, eventBus, styles, pathMap, canvas, textRenderer, 1001);

    const computeStyle = styles.computeStyle;

    const defaultFillColor = config && config.defaultFillColor,
        defaultStrokeColor = config && config.defaultStrokeColor;

    function drawPath(parentGfx, d, attrs) {

      attrs = computeStyle(attrs, [ 'no-fill' ], {
        strokeWidth: 2,
        stroke: 'black'
      });

      const path = svgCreate('path');
      svgAttr(path, { d: d });
      svgAttr(path, attrs);

      svgAppend(parentGfx, path);

      return path;
    }

    this.quantMeHandlers = {
      [consts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS]: function(self, parentGfx, element) {
        var subprocess = self.renderer('bpmn:SubProcess')(parentGfx, element);

        var pathData = quantMEPathMap.getPath('SUBPROCESS_QUANTUM_HARDWARE_SELECTION');

        drawPath(parentGfx, pathData, {
          transform:'scale(0.5)',
          strokeWidth: 1.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        // create circuit paths with filled shapes
        pathData = quantMEPathMap.getPath('SUBPROCESS_QUANTUM_HARDWARE_SELECTION_FILL');
        drawPath(parentGfx, pathData, {
          transform:'scale(0.5)',
          strokeWidth: 1.5,
          fill: getFillColor(element, '#000000'),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        return subprocess;
      },
      ...
    };
  }

  renderer(type) {
    return this.handlers[type];
  }

  canRender(element) {
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Only return true for your extension elements or you might break other plugins
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // default elements can be handled
    if (super.canRender(element)) {
      return true;
    }

    // QuantME elements can be handled
    for (var i = 0; i < quantmeReplaceOptions.TASK.length; i++) {
      if (element.type === quantmeReplaceOptions.TASK[i].target.type) {
        return true;
      }
    }

    // Do not return in every case, only return if your render can render it, else return nothing
    // If nothing is returned, the next renderer is called
    // console.log('Unable to render element of type: ' + element.type);
    // return false;
  }

  drawShape(parentNode, element) {

    // handle QuantME elements
    if (element.type in this.quantMeHandlers) {
      var h = this.quantMeHandlers[element.type];

      /* jshint -W040 */
      return h(this, parentNode, element);
    }
  }

  drawConnection(parentGfx, element) {

    console.log("Draw Connection of type " + element.type)

    if (element.type in this.quantMeHandlers) {
      let h = this.quantMeHandlers[element.type];
      return h(this, parentGfx, element);
    }

    return super.drawConnection(parentGfx, element);
  }

    // evtl nicht notwendig weil die klasse nicht vom BaseRenderer erbt
  getShapePath(shape) {
        if (is(shape, consts.PLANQK_SERVICE_TASK)) {
            return getRoundRectPath(shape, TASK_BORDER_RADIUS);
        }

        return super.getShapePath(shape);
  }
}

QuantMERenderer.$inject = [
  'config',
  'eventBus',
  'styles',
  'pathMap',
  'quantMEPathMap',
  'canvas',
  'textRenderer'
];

```