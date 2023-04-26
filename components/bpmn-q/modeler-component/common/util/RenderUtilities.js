import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
    innerSVG,
    select as svgSelect
} from 'tiny-svg';

export function drawPath(parentGfx, d, attrs) {

    const path = svgCreate('path');
    svgAttr(path, {d: d});
    svgAttr(path, attrs);

    svgAppend(parentGfx, path);

    return path;
}

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

export function drawTaskSVG(parentGfx, importSVG, svgAttributes) {
    const innerSvgStr = importSVG.svg,
        transformDef = importSVG.transform;

    const groupDef = svgCreate('g');
    svgAttr(groupDef, {transform: transformDef});
    innerSVG(groupDef, innerSvgStr);

    // set task box opacity to 0 such that icon can be in the background
    svgAttr(svgSelect(parentGfx, 'rect'), {'fill-opacity': 0});

    if (svgAttributes) {
        svgAttr(groupDef, svgAttributes);
    }

    // draw svg in the background
    parentGfx.prepend(groupDef);
}

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