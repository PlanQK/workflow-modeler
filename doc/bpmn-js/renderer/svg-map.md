# SVG Map
```javascript
'UNIQUE_SVG_ID': {
    transform: 'matrix( Scalingfactor, 0, 0, Scalingfactor, shift-X, shift-y)',
    viewBox: 'min-x min-y width height',
    svg: '<svg> ... </svg>'
}
```
To render custom SVGs in your custom extension elements, like a custom task type, use a SVG map to store your SVGs. Each SVG is a separate entry in the map with a unique id. The value of this entry is an object with a required 'svg' attribute and an optional 'transform' attribute. The 'svg' attribute contains the SVG. To insert SVGs easily just open them in your browser, copy the outer html and insert it using ctrl + alt + shift + v in Intellij to avoid formatting, escaping etc. The 'transform' attribute contains a transformation matrix, refer the following table for further details. If you want to use the same svg in different entries, because they have different transforamtions for example, define a constant at the top of the file for the SVG.

| Attribute | | Description |
| ----- | ----- | ----- |
| transform | required | Transformation matrix to move the svg, structure: matrix( Scalingfactor, 0, 0, Scalingfactor, shift-X, shift-y) |
| viewBox | optional | Definition of the ViewBox, like the SVG 'viewBox' attribute |
| svg | required | XML representation of the SVG |

The SVG map respectively, the getSVG-function, can be used to render custom icons in your custom renderer.  

### Example:
```javascript
const LOGO = '<svg> <path stroke="#000" stroke-width="1" fill="none" d="..."/> </svg>';

export function getSVG(svgId) {

  const svgMap = {
    'TASK_TYPE_MY_TASK_LOGO': {transform: 'matrix(0.2, 0, 0, 0.2, 5, 5)', svg: LOGO},
    'DATA_TYPE_MY_DATA_LOGO': {transform: 'matrix(0.18, 0, 0, 0.18, 12, 27)', viewBox: '0 0 10 10', svg: LOGO},
    'TASK_TYPE_MY_SECOND_TASK': {transform: 'matrix(0.18, 0, 0, 0.18, 12, 27)', svg: '<svg> ... </svg>'},
  };

  return svgMap[svgId];
}
```