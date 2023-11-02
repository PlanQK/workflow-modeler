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
import * as quantmeReplaceOptions from "./PatternReplaceOptions";
import * as consts from "../Constants";
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  innerSVG,
  select as svgSelect,
} from "tiny-svg";
import { getFillColor, getStrokeColor } from "bpmn-js/lib/draw/BpmnRenderUtil";
import { getQuantMESVG } from "./PatternSVGMap";
import { queryAll as domQueryAll } from "min-dom";

/**
 * This class extends the default BPMNRenderer to render the newly introduced QuantME task types
 */
export default class QuantMERenderer extends BpmnRenderer {
  constructor(
    config,
    eventBus,
    styles,
    pathMap,
    quantMEPathMap,
    canvas,
    textRenderer
  ) {
    super(config, eventBus, styles, pathMap, canvas, textRenderer, 1001);

    var computeStyle = styles.computeStyle;

    var defaultFillColor = config && config.defaultFillColor,
      defaultStrokeColor = config && config.defaultStrokeColor;

    function drawEventSVG(parentGfx, iconID) {
      var importsvg = getQuantMESVG(iconID);
      var innerSVGstring = importsvg.svg;
      var transformDef = importsvg.transform;

      const groupDef = svgCreate("g");
      svgAttr(groupDef, { transform: transformDef });
      innerSVG(groupDef, innerSVGstring);

      // set task box opacity to 0 such that icon can be in the background
      //svgAttr(svgSelect(parentGfx, "rect"), { "fill-opacity": 0 });
      console.log(parentGfx);
      svgAttr(svgSelect(parentGfx, "circle"), { "fill-opacity": 0 });
      // draw svg in the background
      parentGfx.prepend(groupDef);
    }

    function drawPath(parentGfx, d, attrs) {
      attrs = computeStyle(attrs, ["no-fill"], {
        strokeWidth: 2,
        stroke: "black",
      });

      const path = svgCreate("path");
      svgAttr(path, { d: d });
      svgAttr(path, attrs);
      svgAppend(parentGfx, path);

      return path;
    }

    this.quantMeHandlers = {
      [consts.GATE_ERROR_MITIGATION]: function (
        self,
        parentGfx,
        element
      ) {
        var subprocess = self.renderer("bpmn:SubProcess")(parentGfx, element);

        var pathData = quantMEPathMap.getPath(
          "SUBPROCESS_QUANTUM_HARDWARE_SELECTION"
        );
        drawPath(parentGfx, pathData, {
          transform: "scale(0.5)",
          strokeWidth: 1.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor),
        });

        // create circuit paths with filled shapes
        pathData = quantMEPathMap.getPath(
          "SUBPROCESS_QUANTUM_HARDWARE_SELECTION_FILL"
        );
        drawPath(parentGfx, pathData, {
          transform: "scale(0.5)",
          strokeWidth: 1.5,
          fill: getFillColor(element, "#000000"),
          stroke: getStrokeColor(element, defaultStrokeColor),
        });

        return subprocess;
      },
      [consts.QUANTUM_KERNEL_ESTIMATION]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none"
        }
        var task = self.renderer("bpmn:Event")(parentGfx, element, attrs);
        drawEventSVG(parentGfx, "QUANTUM_KERNEL_ESTIMATION");
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
        var task = self.renderer("bpmn:Event")(parentGfx, element, attrs);
        drawEventSVG(parentGfx, "ALTERNATING_OPERATOR_ANSATZ");
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
        var task = self.renderer("bpmn:Event")(parentGfx, element, attrs);
        drawEventSVG(parentGfx, "QUANTUM_APPROXIMATE_OPTIMIZATION_ALGORITHM");
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
        var task = self.renderer("bpmn:Event")(parentGfx, element, attrs);
        drawEventSVG(parentGfx, "QUANTUM_PHASE_ESTIMATION");
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
        var task = self.renderer("bpmn:Event")(parentGfx, element, attrs);
        drawEventSVG(parentGfx, "VARIATIONAL_QUANTUM_ALGORITHM");
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
        var task = self.renderer("bpmn:Event")(parentGfx, element, attrs);
        drawEventSVG(parentGfx, "VARIATIONAL_QUANTUM_EIGENSOLVER");
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
        var task = self.renderer("bpmn:Event")(parentGfx, element, attrs);
        drawEventSVG(parentGfx, "ORCHESTRATED_EXECUTION");
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
        var task = self.renderer("bpmn:Event")(parentGfx, element, attrs);
        drawEventSVG(parentGfx, "PRE_DEPLOYED_EXECUTION");
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
        var task = self.renderer("bpmn:Event")(parentGfx, element, attrs);
        drawEventSVG(parentGfx, "PRIORITIZED_EXECUTION");
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
        var task = self.renderer("bpmn:Event")(parentGfx, element, attrs);
        drawEventSVG(parentGfx, "ERROR_CORRECTION");
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
        var task = self.renderer("bpmn:Event")(parentGfx, element, attrs);
        drawEventSVG(parentGfx, "READOUT_ERROR_MITIGATION");
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
        var task = self.renderer("bpmn:Event")(parentGfx, element, attrs);
        drawEventSVG(parentGfx, "GATE_ERROR_MITIGATION");
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
        var task = self.renderer("bpmn:Event")(parentGfx, element, attrs);
        drawEventSVG(parentGfx, "WARM_START");
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

    // QuantME elements can be handled
    for (var i = 0; i < quantmeReplaceOptions.ALGORITHM_PATTERN.length; i++) {
      if (element.type === quantmeReplaceOptions.ALGORITHM_PATTERN[i].target.type) {
        return true;
      }
    }

    // QuantME elements can be handled
    for (var i = 0; i < quantmeReplaceOptions.BEHAVIORAL_PATTERN.length; i++) {
      if (element.type === quantmeReplaceOptions.BEHAVIORAL_PATTERN[i].target.type) {
        return true;
      }
    }

    // QuantME elements can be handled
    for (var i = 0; i < quantmeReplaceOptions.AUGMENTATION_PATTERN.length; i++) {
      if (element.type === quantmeReplaceOptions.AUGMENTATION_PATTERN[i].target.type) {
        return true;
      }
    }

    console.log("Unable to render element of type: " + element.type);
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
  "config",
  "eventBus",
  "styles",
  "pathMap",
  "quantMEPathMap",
  "canvas",
  "textRenderer",
];
