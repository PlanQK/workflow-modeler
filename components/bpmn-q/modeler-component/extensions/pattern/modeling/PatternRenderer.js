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

import BpmnRenderer from "bpmn-js/lib/draw/BpmnRenderer";
import * as patternReplaceOptions from "./PatternReplaceOptions";
import * as consts from "../Constants";
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  innerSVG,
  select as svgSelect,
} from "tiny-svg";
import { getPatternSVG } from "./PatternSVGMap";
import { queryAll as domQueryAll } from "min-dom";

/**
 * This class extends the default BPMNRenderer to render the newly introduced patterns
 */
export default class PatternRenderer extends BpmnRenderer {
  constructor(
    config,
    eventBus,
    styles,
    pathMap,
    patternPathMap,
    canvas,
    textRenderer
  ) {
    super(config, eventBus, styles, pathMap, canvas, textRenderer, 1001);

    var computeStyle = styles.computeStyle;

    function drawTaskSVG(parentGfx, iconID) {
      var importsvg = getPatternSVG(iconID);
      var innerSVGstring = importsvg.svg;
      var transformDef = importsvg.transform;

      const groupDef = svgCreate("g");
      svgAttr(groupDef, { transform: transformDef });
      innerSVG(groupDef, innerSVGstring);

      // set task box opacity to 0 such that icon can be in the background
      svgAttr(svgSelect(parentGfx, "rect"), { "fill-opacity": 0 });

      // draw svg in the background
      parentGfx.prepend(groupDef);
    }

    this.patternHandlers = {
      [consts.QUANTUM_KERNEL_ESTIMATOR]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none"
        }
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawTaskSVG(parentGfx, "QUANTUM_KERNEL_ESTIMATOR");
        return task;
      },
      [consts.ALTERNATING_OPERATOR_ANSATZ]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none"
        }
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawTaskSVG(parentGfx, "ALTERNATING_OPERATOR_ANSATZ");
        return task;
      },
      [consts.QUANTUM_APPROXIMATE_OPTIMIZATION_ALGORITHM]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none"
        }
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawTaskSVG(parentGfx, "QUANTUM_APPROXIMATE_OPTIMIZATION_ALGORITHM");
        return task;
      },
      [consts.QUANTUM_PHASE_ESTIMATION]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none"
        }
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawTaskSVG(parentGfx, "QUANTUM_PHASE_ESTIMATION");
        return task;
      },
      [consts.VARIATIONAL_QUANTUM_ALGORITHM]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none"
        }
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawTaskSVG(parentGfx, "VARIATIONAL_QUANTUM_ALGORITHM");
        return task;
      },
      [consts.VARIATIONAL_QUANTUM_EIGENSOLVER]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none"
        }
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawTaskSVG(parentGfx, "VARIATIONAL_QUANTUM_EIGENSOLVER");
        return task;
      },
      [consts.ORCHESTRATED_EXECUTION]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none"
        }
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawTaskSVG(parentGfx, "ORCHESTRATED_EXECUTION");
        return task;
      },
      [consts.PRE_DEPLOYED_EXECUTION]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none"
        }
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawTaskSVG(parentGfx, "PRE_DEPLOYED_EXECUTION");
        return task;
      },
      [consts.PRIORITIZED_EXECUTION]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none"
        }
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawTaskSVG(parentGfx, "PRIORITIZED_EXECUTION");
        return task;
      },
      [consts.ERROR_CORRECTION]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none"
        }
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawTaskSVG(parentGfx, "ERROR_CORRECTION");
        return task;
      },
      [consts.READOUT_ERROR_MITIGATION]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none"
        }
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawTaskSVG(parentGfx, "READOUT_ERROR_MITIGATION");
        return task;
      },
      [consts.GATE_ERROR_MITIGATION]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none"
        }
        console.log(parentGfx)
        element.width = 43;
        element.height = 43;

        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawTaskSVG(parentGfx, "GATE_ERROR_MITIGATION");
        return task;
      },
      [consts.WARM_START]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none"
        }
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawTaskSVG(parentGfx, "WARM_START");
        return task;
      },
      [consts.CIRCUIT_CUTTING]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none"
        }
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawTaskSVG(parentGfx, "CIRCUIT_CUTTING");
        return task;
      },
      [consts.PATTERN]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none"
        }
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawTaskSVG(parentGfx, "PATTERN");
        return task;
      },
    };

    setTimeout(function () {
      // TODO: pullrequest to change BpmnRenderer.js if issue persists in new Version
      // extract markers out of task icon svgs when loading a saved diagram
      // due to restrictions in BpmnRenderer.js that places them in first defs element in svg

      var existingDefs = domQueryAll("marker", canvas._svg);
      if (existingDefs != null) {
        var createdNewDefs = false;
        for (let i = 0; i < existingDefs.length; i++) {
          if (existingDefs[i].parentElement.parentElement.nodeName !== "svg") {
            if (createdNewDefs === false) {
              var newDefs = svgCreate("defs");
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


    // pattern elements can be handled
    for (var i = 0; i < patternReplaceOptions.ALGORITHM_PATTERN.length; i++) {
      if (element.type === patternReplaceOptions.ALGORITHM_PATTERN[i].target.type) {
        return true;
      }
    }

    // pattern elements can be handled
    for (var i = 0; i < patternReplaceOptions.BEHAVIORAL_PATTERN.length; i++) {
      if (element.type === patternReplaceOptions.BEHAVIORAL_PATTERN[i].target.type) {
        return true;
      }
    }

    // pattern elements can be handled
    for (var i = 0; i < patternReplaceOptions.AUGMENTATION_PATTERN.length; i++) {
      if (element.type === patternReplaceOptions.AUGMENTATION_PATTERN[i].target.type) {
        return true;
      }
    }

    if(element.type === consts.PATTERN) {
      return true;
    }

    console.log("Unable to render element of type: " + element.type);
    return false;
  }

  drawShape(parentNode, element) {
    // handle pattern elements
    if (element.type in this.patternHandlers) {
      var h = this.patternHandlers[element.type];

      /* jshint -W040 */
      return h(this, parentNode, element);
    }
  }
}

PatternRenderer.$inject = [
  "config",
  "eventBus",
  "styles",
  "pathMap",
  "patternPathMap",
  "canvas",
  "textRenderer",
];
