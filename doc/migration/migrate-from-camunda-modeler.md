# Migration from Camunda Modeler to Quantum Workflow Modeler
This file describes, what to look for when migrating the QuantME Transformation Framework 
from the [Camunda Modeler](https://github.com/camunda/camunda-modeler) to the Quantum Workflow Modeler 
which is based on the [bpmn-js Modeler](https://github.com/bpmn-io/bpmn-js/). To ease the traceability of the changes made to
integrate the QuantME Transformation Framework into the Quantum Workflow Modeler, the folder structure and the class and 
script names were not changed during migration. Therefore, you can look for the class or script you want to migrate in the
Quantum Workflow Modeler to find out how it was transformed.

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
The code is located in the [modal directory](../../components/bpmn-q/modeler-component/editor/ui/modal).

###### Fill
The Fill component will no longer work, because it allows plugging buttons directly into a predefined toolbar of the Camunda Modeler.
Adding buttons to the toolbar of the Quantum Workflow Modeler is managed by the [ButtonToolbar](../../components/bpmn-q/modeler-component/editor/ui/ButtonToolbar.js).
To style the buttons, the ```toolbar-btn``` CSS class from [editor-ui.css](../../components/bpmn-q/modeler-component/editor/resources/styling/editor-ui.css) 
can be used.

## Electron API
All code which uses the electron backend of the Camunda modeler must be adapted because electron is not used in the Quantum
Workflow Modeler. The calls to electron can be replaced by direct calls or direct access of the required properties. Refer 
to the respective classes and scripts of the QuantME plugin to see how they were replaced.

## Properties Panel
The properties panel was recreated during migration because the Quantum Workflow Modeler uses a newer version of the Properties 
Panel. Refer to [this guide](../extend%20bpmn-js/properties-panel/custom-properties-panel.md) or the [Camunda Documentation](https://github.com/bpmn-io/bpmn-js-examples/tree/master/properties-panel-extension) 
to find out how the new version allows the extension of the properties panel or check the
implementation of the [Properties Provider of the QuantME plugin](../../components/bpmn-q/modeler-component/extensions/quantme/modeling/properties-provider/QuantMEPropertiesProvider.js).

Basically in the new version, properties are grouped in groups. Each group is defined by a set of properties. Each property 
is represented by one entry which defines the representation of this entry in the properties panel.

## Replace Menu Provider
Through the upgrade of the bpmn-js version, the recommended way to add custom ReplaceMenuProviders changed. Refer to [this guider](../extend%20bpmn-js/menu-entries/custom-replace-entries.md) 
for further information. The Replace Menu Provider of the QuantME Transformation Framework has to be changed to this structure.

## UI extensions
The buttons and the config dialog of the QuantME transformation framework are adapted to the extensions of the UI the Quantum
Workflow Modeler allows. Therefore, all tabs of the config dialog are separated in React components, one component per tab,
and added via the Plugin Object to the modeler. The buttons of the QuantME framework were grouped into one Extensible Button
and also added via the Plugin Object to the UI of the modeler. Refer [this guide](../quantum-workflow-modeler/editor/ui-extension/extend-ui-via-plugin-object.md) 
for further information on how to extend the UI of the Quantum Workflow Modeler.

## Utility Functions
Many Utility function which where available in the Camunda Modeler are no longer available in bpmn-js. Refer to the [Utilities of the editor](../../components/bpmn-q/modeler-component/editor/util)
for some custom utilities, also to replace broken utility functions in your QunatME code. To further ease the migration,
some utility functions of camunda are copied into [this directory](../../components/bpmn-q/modeler-component/editor/util/camunda-utils)
which can be used to replace the calls to the camunda modeler utilities.

## Access of the DI
To access the diagram element of a business object, you can no longer use ```.di```. You now have to use ```getDi()``` 
from ModelUtil like described in [this issue](https://github.com/bpmn-io/bpmn-js/issues/1472).