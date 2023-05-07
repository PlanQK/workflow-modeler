# SVG Map
To handle the use of SVGs in the rendering of custom elements, SVG Maps can be defined. An SVG map consists of a function which returns 
an SVG entry for a given ID:
````javascript
export function getSVG(svgId) {

    const svgMap = {
        ['svg1']: {
            transform: 'matrix(0.17, 0, 0, 0.17, 7, 7)',
            svg: '<svg>...</svg>' 
        },
        [svg2]: {
            transform: 'matrix(0.14, 0, 0, 0.14, 4, 4)',
            svg: '<svg>...</svg>'
        }
    };

    return svgMap[svgId];
}
````

To render custom SVGs in your custom extension elements, like a custom task type, use a SVG map to store your SVGs. Each SVG is a separate entry in the map with a unique id. The value of this entry is an object with a required 'svg' attribute and an optional 'transform' attribute. The 'svg' attribute contains the SVG. To insert SVGs easily just open them in your browser, copy the outer html and insert it using ctrl + alt + shift + v in Intellij to avoid formatting, escaping etc. The 'transform' attribute contains a transformation matrix, refer the following table for further details. If you want to use the same svg in different entries, because they have different transforamtions for example, define a constant at the top of the file for the SVG.

| Attribute | | Description |
| ----- | ----- | ----- |
| transform | required | Transformation matrix to move the svg, structure: matrix( Scalingfactor, 0, 0, Scalingfactor, shift-X, shift-y) |
| viewBox | optional | Definition of the ViewBox, like the SVG 'viewBox' attribute |
| svg | required | XML representation of the SVG |

The SVG map respectively, the getSVG-function, can be used to render custom icons in your custom renderer.

Example:
```javascript
const svgMap = {
    ['svgId1']: {
        transform: 'matrix(0.17, 0, 0, 0.17, 7, 7)',
        svg: '<svg>...</svg>'
    }, 
}
```