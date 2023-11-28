# QHAna Plugin
Plugin which integrates elements for modeling QHAna Services, loaded from the [QHAna Plugin Registry](https://github.com/UST-QuAntiL/qhana-plugin-registry) as configurations. 

## Overview
An overview of all modeling elements:
![QHAna Overview](QHAna-Overview.png)

## Structure
- [QHAna Plugin Object](../../../../components/bpmn-q/modeler-component/extensions/qhana/QHAnaPlugin.js)
- [QHAna Plugin Config](../../../../components/bpmn-q/modeler-component/extensions/qhana/config/QHAnaConfigManager.js)
- [QHAna Transformation Function](../../../../components/bpmn-q/modeler-component/extensions/qhana/transformation/QHAnaTransformationHandler.js)
- [QHAna Service Task Configurations](../../../../components/bpmn-q/modeler-component/extensions/qhana/configurations)
- bpmn-js Extension Module
  - [Replace Menu Provider](../../../../components/bpmn-q/modeler-component/extensions/qhana/menu/QHAnaReplaceMenuProvider.js)
  - [Properties Panel Provider](../../../../components/bpmn-q/modeler-component/extensions/qhana/properties/QHAnaPropertiesProvider.js)
  - [Rendering](../../../../components/bpmn-q/modeler-component/extensions/qhana/rendering/QHAnaRenderer.js)