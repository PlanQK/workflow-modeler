/**
 * Copyright (c) 2023 Institute of Architecture of Application Systems -
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
import { append as svgAppend, attr as svgAttr, create as svgCreate, innerSVG, select as svgSelect } from 'tiny-svg';
import { getFillColor, getStrokeColor } from 'bpmn-js/lib/draw/BpmnRenderUtil';
import { getQuantMESVG } from './QuantMESVGMap';
import {
  queryAll as domQueryAll
} from 'min-dom';


/**
 * This class extends the default BPMNRenderer to render the newly introduced QuantME task types
 */
export default class QuantMERenderer extends BpmnRenderer {
  constructor(config, eventBus, styles, pathMap, quantMEPathMap, canvas, textRenderer) {
    super(config, eventBus, styles, pathMap, canvas, textRenderer, 1001);

    var computeStyle = styles.computeStyle;

    var defaultFillColor = config && config.defaultFillColor,
        defaultStrokeColor = config && config.defaultStrokeColor;

    function drawTaskSVG(parentGfx, iconID) {
      var importsvg = getQuantMESVG(iconID);
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
      [consts.CIRCUIT_CUTTING_SUBPROCESS]: function(self, parentGfx, element) {
        var subprocess = self.renderer('bpmn:SubProcess')(parentGfx, element);
        drawTaskSVG(parentGfx, 'SUBPROCESS_TYPE_CIRCUIT_CUTTING');
        return subprocess;
      },
      [consts.QUANTUM_COMPUTATION_TASK]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);

        var pathData = quantMEPathMap.getPath('TASK_TYPE_QUANTUM_COMPUTATION');

        drawPath(parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        return task;
      },
      [consts.QUANTUM_CIRCUIT_LOADING_TASK]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);

        // create circuit paths without filled shapes
        var pathData = quantMEPathMap.getPath('TASK_TYPE_CIRCUIT_LOADING');
        drawPath(parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultStrokeColor),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        // create circuit paths with filled shapes
        pathData = quantMEPathMap.getPath('TASK_TYPE_CIRCUIT_LOADING_FILL');
        drawPath(parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, '#000000'),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        return task;
      },
      [consts.DATA_PREPARATION_TASK]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);

        var pathData = quantMEPathMap.getPath('TASK_TYPE_DATA_PREPARATION');
        drawPath(parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        // create circuit paths with filled shapes (black)
        pathData = quantMEPathMap.getPath('TASK_TYPE_DATA_PREPARATION_FILL_BLACK');
        drawPath(parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, '#000000'),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        // create circuit paths with filled shapes (background color)
        pathData = quantMEPathMap.getPath('TASK_TYPE_DATA_PREPARATION_FILL_BACKGROUND');
        drawPath(parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultStrokeColor),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        // create circuit paths with dashed shapes
        pathData = quantMEPathMap.getPath('TASK_TYPE_DATA_PREPARATION_DASHED');
        drawPath(parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          strokeDasharray: 5,
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        // create white line for database
        pathData = quantMEPathMap.getPath('TASK_TYPE_DATA_PREPARATION_BACKGROUND');
        drawPath(parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          stroke: getFillColor(element, '#FFFFFF')
        });

        return task;
      },
      [consts.ORACLE_EXPANSION_TASK]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);

        var pathData = quantMEPathMap.getPath('TASK_TYPE_ORACLE_EXPANSION');
        drawPath(parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        // create circuit paths with filled shapes
        pathData = quantMEPathMap.getPath('TASK_TYPE_ORACLE_EXPANSION_FILL_BLACK');
        drawPath(parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, '#000000'),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        // create oracle box
        pathData = quantMEPathMap.getPath('TASK_TYPE_ORACLE_EXPANSION_BOX');
        drawPath(parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, '#000000'),
          stroke: getStrokeColor(element, '#FFF')
        });

        // create arrow
        pathData = quantMEPathMap.getPath('TASK_TYPE_ORACLE_EXPANSION_ARROW');
        drawPath(parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, '#000000'),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        return task;
      },
      [consts.QUANTUM_CIRCUIT_EXECUTION_TASK]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);

        var pathData = quantMEPathMap.getPath('TASK_TYPE_CIRCUIT_EXECUTION');
        drawPath(parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        pathData = quantMEPathMap.getPath('TASK_TYPE_CIRCUIT_EXECUTION_FILL');
        drawPath(parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, '#000000'),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        return task;
      },
      [consts.READOUT_ERROR_MITIGATION_TASK]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);
        drawTaskSVG(parentGfx, 'TASK_TYPE_ERROR_MITIGATION');
        return task;
      },
      [consts.WARM_STARTING_TASK]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);
        drawTaskSVG(parentGfx, 'TASK_TYPE_WARM_STARTING');
        return task;
      },
      [consts.PARAMETER_OPTIMIZATION_TASK]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);
        drawTaskSVG(parentGfx, 'TASK_TYPE_PARAMETER_OPTIMIZATION');
        return task;
      },
      [consts.RESULT_EVALUATION_TASK]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);
        setTimeout(function() {}, 10000);
        drawTaskSVG(parentGfx, 'TASK_TYPE_RESULT_EVALUATION');
        return task;
      },
      [consts.VARIATIONAL_QUANTUM_ALGORITHM_TASK]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);
        drawTaskSVG(parentGfx, 'TASK_TYPE_VQA');
        return task;
      }
    };

    setTimeout(function() {

      // TODO: pullrequest to change BpmnRenderer.js if issue persists in new Version
      // extract markers out of task icon svgs when loading a saved diagram
      // due to restrictions in BpmnRenderer.js that places them in first defs element in svg

      var existingDefs = domQueryAll('marker', canvas._svg);
      if (existingDefs != null) {
        var createdNewDefs = false;
        for (let i = 0; i < existingDefs.length; i++) {
          if (existingDefs[i].parentElement.parentElement.nodeName !== 'svg') {
            if (createdNewDefs === false) {
              var newDefs = svgCreate('defs');
              svgAppend(canvas._svg, newDefs);
              createdNewDefs = true;
            }
            svgAppend(newDefs, existingDefs[i]);
          }
        }
      }
    }, 1000);
  }

  renderer(type) {
    return this.handlers[type];
  }

  canRender(element) {

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

    console.log('Unable to render element of type: ' + element.type);
    return false;
  }

  drawShape(parentNode, element) {

    // handle QuantME elements
    if (element.type in this.quantMeHandlers) {
      var h = this.quantMeHandlers[element.type];

      /* jshint -W040 */
      return h(this, parentNode, element);
    }

    // use parent class for all non QuantME elements
    return super.drawShape(parentNode, element);
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