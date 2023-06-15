import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  innerSVG,
  select as svgSelect,
} from "tiny-svg";

/**
 * Draw svg path with the given attributes.
 *
 * @param parentGfx The element the path is appended to
 * @param d The SVG path
 * @param attrs The given attributes
 * @returns {SVGPathElement}
 */
export function drawPath(parentGfx, d, attrs) {
  const path = svgCreate("path");
  svgAttr(path, { d: d });
  svgAttr(path, attrs);

  svgAppend(parentGfx, path);

  return path;
}

/**
 * Draw the given SVG in the parent element of type BPMN task
 *
 * @param parentGfx The parent element the SVG is drawn in
 * @param importSVG The SVG
 * @param svgAttributes Attributes for the SVG
 */
export function drawTaskSVG(parentGfx, importSVG, svgAttributes) {
  const innerSvgStr = importSVG.svg,
    transformDef = importSVG.transform;

  const groupDef = svgCreate("g");
  svgAttr(groupDef, { transform: transformDef });
  innerSVG(groupDef, innerSvgStr);

  // set task box opacity to 0 such that icon can be in the background
  svgAttr(svgSelect(parentGfx, "rect"), { "fill-opacity": 0 });

  if (svgAttributes) {
    svgAttr(groupDef, svgAttributes);
  }

  // draw svg in the background
  parentGfx.prepend(groupDef);
}

/**
 * Draw the given SVG in the parent element of type BPMN DataObject
 *
 * @param parentGfx The parent element the SVG is drawn in
 * @param importSVG The SVG
 * @param svgAttributes Attributes for the SVG
 */
export function drawDataElementSVG(parentGfx, importSVG, svgAttributes) {
  const innerSvgStr = importSVG.svg,
    transformDef = importSVG.transform;

  const groupDef = svgCreate("g");
  svgAttr(groupDef, { transform: transformDef });
  innerSVG(groupDef, innerSvgStr);

  if (svgAttributes) {
    svgAttr(groupDef, svgAttributes);
  }

  parentGfx.append(groupDef);
}
