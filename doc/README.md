# Documentation
This is the documentation of the Quantum Workflow Modeler. It provides 
all necessary information to understand, install and extend this
project.

## Table of Content
This documentation contains of the following sections:

### [Developer Setup](devloper-setup/developer-setup.md)
Guide for developers to set up this project for further development

### Integration Guide
Guide on how to integrate the Quantum Workflow Modeler component in your web application.

### Testing
Description of the testing setup including the used GitHub actions to run them. This section contains
a guide on how to write unit tests for plugins to allow new developers to test their modelling extensions and their 
integration in a structured and automated manner.

### Modeler Documentation
Documentation of the Quantum Workflow Modeler. Contains information to the interfaces and components it provides and the already integrated
Plugin documentation. The content of this section is divided in the following subsections:
1. Editor Component
   1. Plugin Handler
   2. Notification Handler
   3. Configuration Modal
   4. Extensible Button
   5. External Interfaces
   6. Utility Functions
2. Extensions
   1. DataFlow Plugin
   2. QuantME Plugin
   3. PlanQK Plugin
   4. QHAna Plugin

### bpmn-js Documentation
Useful information and documentation on how to use and extend the bpmn-js modeler and its component. The content is based on personal experience, the [bpmn-js Walkthrough]() and the source code of the [bpmn-js Modeler]. This documentation may help you to extend the bpmn-js modeler to write your own custom modelling extensions. use on your own risc.
Consists of the following sections:
 - Context Pad
 - Menu Entries
 - Palette Provider
 - Renderer