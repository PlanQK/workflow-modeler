import {getSVG} from "../../extensions/planqk/SVGMap";
import {append as svgAppend, attr as svgAttr, create as svgCreate, innerSVG, select as svgSelect} from "tiny-svg";

export function drawPath(parentGfx, d, attrs) {

    const path = svgCreate('path');
    svgAttr(path, { d: d });
    svgAttr(path, attrs);

    svgAppend(parentGfx, path);

    return path;
}

export function drawTaskSVG(parentGfx, iconID) {
    const importSVG = getSVG(iconID);
    const innerSVGstr = importSVG.svg;
    const transformDef = importSVG.transform;

    const groupDef = svgCreate('g');
    svgAttr(groupDef, { transform: transformDef });
    innerSVG(groupDef, innerSVGstr);

    // set task box opacity to 0 such that icon can be in the background
    svgAttr(svgSelect(parentGfx, 'rect'), { 'fill-opacity': 0 });

    // draw svg in the background
    parentGfx.prepend(groupDef);
}

export function drawDataStoreSVG(parentGfx, iconID) {
    var importsvg = getSVG(iconID);
    var innerSVGstring = importsvg.svg;
    var transformDef = importsvg.transform;

    const groupDef = svgCreate('g');
    svgAttr(groupDef, { transform: transformDef });
    innerSVG(groupDef, innerSVGstring);

    // draw svg in the background
    parentGfx.append(groupDef);
}