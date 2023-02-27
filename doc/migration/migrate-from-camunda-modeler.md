# Migration from Camunda Modeler to Quantum Workflow Modeler
This file describes, what to look for when migrating the QuantME Transformation Framework 
from the [Camunda Modeler](https://github.com/camunda/camunda-modeler) to the Quantum Workflow Modeler 
which is based on the [bpmn-js Modeler](https://github.com/bpmn-io/bpmn-js/)

## Camunda Modeler Plugin Helper  
This Plugin Helpers require the Camunda Modeler which is not available in the Quantum Workflow Modeler.
Therefor all code from this library must be replaced. Some imports using this plugin are
not necessary in the Quantum Workflow Modeler because a simpler way exists. The following list shows how 
to replace the library in the Quantum Workflow Modeler:

##### Register Plugins
All functions used to register code in the modeler can be deleted. They are no longer necessary. They 
can be directly integrated using the [Modeler Handler](../../components/bpmn-q/modeler-component/editor/ModelerHandler.js)

##### Import React or React functions
All imports used to import React or React functions, e.g. in the ui elements, can be replaced by a
direct import from React:
```javascript
// camunda modeler code using the camunda modeler plugin helper
import React, {useState, useRef, PureComponent, Component} from 'camunda-modeler-plugin-helpers/react';

// replaced code
import React, {useState, useRef, PureComponent, Component} from 'react';
```
NOTICE: Your IDEA may suggest you to import React from ```@bpmn-io/properties-panel/preact/compat``` which will not work 
for components rendered outside the properties panel. Use ```react``` to import React.

##### Import of Camunda Modeler specific UI elements
If the Plugin Helper was used to import UI components like Modal or Fill, these components need to be rewritten or manually 
imported by copy-paste from the Camunda Modeler code in the [QuantME Transformation Framework repository](https://github.com/UST-QuAntiL/QuantME-TransformationFramework/tree/develop/client/src/app/primitives) under ```client 
-> src -> app -> primitives```. Some UI Component made available through the Plugin Helper are already rewritten in the Quantum
Workflow Modeler. For further details see the following sections:

###### Modal
The code for displaying modals is already copied from the QuantME repository and can be used via import:
```javascript
import Modal from '../../../../common/camunda-components/modal/Modal';
```
The code is located in the [modal directory](../../components/bpmn-q/modeler-component/common/camunda-components/modal).

###### Fill
The Fill component will no longer work, because it allows plugging buttons directly into a predefined toolbar of the Camunda Modeler.
Adding buttons to the toolbar of the Quantum Workflow Modeler is managed by the [ButtonToolbar](../../components/bpmn-q/modeler-component/editor/ui/ButtonToolbar.js).
To style the buttons, the ```toolbar-btn``` CSS class from [editor-ui.css](../../components/bpmn-q/modeler-component/editor/resources/styling/editor-ui.css) 

## 