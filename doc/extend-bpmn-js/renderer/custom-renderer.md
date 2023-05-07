# Custom Renderer for bpmn-js
This guide shows how you can define your own renderer to render the elements of your extension differently.

To create a custom render, create a class which inherits from BpmnRenderer. Define in the constructor a set of handlers
which define how to render elements of a specific type. In the following example, two handlers are defined. The first one 
renders a shape based on the DataObject and customized with a custom icon, defined as SVG and imported from an [SVG Map](svg-map.md).
The scond one renders a Task with a custom icon defined as SVG. To customize the rendering, several helper functions can be found 
in [RenderUtilities](../../../components/bpmn-q/modeler-component/editor/util/RenderUtilities.js).

```javascript
export default class CustomRenderer extends BpmnRenderer {
    
    constructor(config, eventBus, styles, pathMap, quantMEPathMap, canvas, textRenderer) {
        super(config, eventBus, styles, pathMap, canvas, textRenderer, 1001);

        this.customHandlers = {
            ['custom:MyData']: function (self, parentGfx, element) {
                const task = self.renderer('bpmn:DataObject')(parentGfx, element);

                let svg = getSVG(consts.DATA_TYPE_DATA_MAP_OBJECT);
                drawDataElementSVG(parentGfx, svg);

                return task;
            },
            ['custom:MyTask']: function (self, parentGfx, element) {
                const task = self.renderer('bpmn:Task')(parentGfx, element);

                let svg = getSVG(consts.TASK_TYPE_TRANSFORMATION_TASK);
                drawTaskSVG(parentGfx, svg);

                return task;
            },
            // ...
        };
    }

    // ...
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

To apply your custom rendering handler, you have to override the ```renderer()```, ```canRender()``` and ```drawShape()```
functions:
```javascript
export default class CustomRenderer extends BpmnRenderer {
    
    // ...
    
    renderer(type) {
        return this.handlers[type];
    }

    canRender(element) {
        // only return true if handler for rendering is registered
        return this.dataFlowHandler[element.type];
    }

    drawShape(parentNode, element) {

        // handle QuantME elements
        if (element.type in this.quantMeHandlers) {
            var h = this.quantMeHandlers[element.type];

            /* jshint -W040 */
            return h(this, parentNode, element);
        }
    }
}    
```