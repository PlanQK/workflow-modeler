import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
    innerSVG,
    select as svgSelect
} from 'tiny-svg';

/**
 * Draw svg path with the given attributes.
 *
 * @param parentGfx The element the path is appended to
 * @param d The SVG path
 * @param attrs The given attributes
 * @returns {SVGPathElement}
 */
export function drawPath(parentGfx, d, attrs) {

    const path = svgCreate('path');
    svgAttr(path, {d: d});
    svgAttr(path, attrs);

    svgAppend(parentGfx, path);

    return path;
}

/**
 * Draw a SVG rectangle with the given width, height, border radius and color
 *
 * Copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
 *
 * @param parentNode The parent element the svg rectangle is appended to.
 * @param width The given width
 * @param height The given height
 * @param borderRadius The given border radius
 * @param color The given color
 * @returns {SVGRectElement}
 */
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

/**
 * Draw the given SVG in the parent element of type BPMN task
 *
 * @param parentGfx The parent element the SVG is drawn in
 * @param importSVG The SVG
 * @param svgAttributes Attributes for the SVG
 * @param foreground true if SVG should be above Task
 * @returns The created svg element
 */
export function drawTaskSVG(parentGfx, importSVG, svgAttributes, foreground) {
    const innerSvgStr = importSVG.svg,
        transformDef = importSVG.transform;

    const groupDef = svgCreate('g');
    svgAttr(groupDef, {transform: transformDef});
    innerSVG(groupDef, innerSvgStr);

    if(!foreground) {
        // set task box opacity to 0 such that icon can be in the background
        svgAttr(svgSelect(parentGfx, 'rect'), { 'fill-opacity': 0 });
    }

    if (svgAttributes) {
        svgAttr(groupDef, svgAttributes);
    }

    if(foreground) {
        parentGfx.append(groupDef);
    } else {
        parentGfx.prepend(groupDef);
    }
    return groupDef;
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

    const groupDef = svgCreate('g');
    svgAttr(groupDef, {transform: transformDef});
    innerSVG(groupDef, innerSvgStr);

    if (svgAttributes) {
        svgAttr(groupDef, svgAttributes);
    }

    parentGfx.append(groupDef);
}