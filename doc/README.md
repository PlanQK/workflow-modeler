# Documentation
This is the documentation for the Quantum Workflow Modeler. It provides all the necessary information to understand, install, and extend this project.

## Table of Contents
This documentation contains the following sections:

### [Developer Setup](developer-setup/developer-setup.md)
A guide for developers to set up this project for further development.

### [Integration Guide](integration-guide/integration-guide.md)
A guide on how to integrate the Quantum Workflow Modeler component into your web application.

### [Migration Guide](migration/migrate-from-camunda-modeler.md)
A guide on how to integrate features from the [QuantME Transformation Framework](https://github.com/UST-QuAntiL/QuantME-TransformationFramework) into the modeler.

### [Testing](testing)
Description of the testing setup, including the GitHub actions used to run them. This section also contains a guide on how to write unit tests for plugins, allowing new developers to test their modeling extensions and their integration in a structured and automated manner.

### Modeler Documentation
Documentation of the Quantum Workflow Modeler. It contains information about the interfaces and components it provides, as well as the already integrated Plugin documentation. The content of this section is divided into the following subsections:
1. [Editor Component](quantum-workflow-modeler/editor/editor-structure.md)
   1. [Plugin Handler](quantum-workflow-modeler/editor/plugin)
   2. [UI extensions](quantum-workflow-modeler/editor/ui-extension/extend-ui-via-plugin-object.md)
   3. [Workflow Event Handler](quantum-workflow-modeler/editor/events/event-handler-doc.md)
   4. [Configurations](quantum-workflow-modeler/editor/configurations/configurations.md)
   5. [Extended Popup Menu](quantum-workflow-modeler/editor/popup-menu/extended-popup-menu.md)
2. Extensions
   1. [DataFlow Plugin](quantum-workflow-modeler/extensions/data-flow-plugin/data-flow-plugin.md)
   2. [QuantME Plugin](quantum-workflow-modeler/extensions/quantme-plugin/quantme-plugin.md)
   3. [PlanQK Plugin](quantum-workflow-modeler/extensions/planqk-plugin/planqk-plugin.md)
   4. [QHAna Plugin](quantum-workflow-modeler/extensions/qhana-plugin/qhana-plugin.md)

### bpmn-js Documentation
Useful information and documentation on how to use and extend the bpmn-js modeler and its components. The content is based on personal experience, the [bpmn-js Walkthrough](https://bpmn.io/toolkit/bpmn-js/walkthrough), and the source code of the [bpmn-js Modeler](https://github.com/bpmn-io/bpmn-js). This documentation may help you extend the bpmn-js modeler to write your own custom modeling extensions. It consists of the following sections:
- [General Notices](extend-bpmn-js/extension-general/general-extension-hints.md)
- [Context Pad](extend-bpmn-js/context-pad/custom-context-pad.md)
- [Menu Entries](extend-bpmn-js/menu-entries/custom-replace-entries.md)
- [Palette Provider](extend-bpmn-js/palette-provider/customize-the-palette.md)
- [Properties Panel](extend-bpmn-js/properties-panel/custom-properties-panel.md)
- [Renderer](extend-bpmn-js/renderer/custom-renderer.md)