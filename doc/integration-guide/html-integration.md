# Integrating the Modeler into plain HTML
To integrate the modeler component into an application built with plain HTML, you have to follow these steps:

## Install npm Package
Register the PlanQK npm namespace and authenticate yourself to GitHub Packages, as described in [the integration guide](integration-guide.md).
Install the npm package of the Quantum Workflow modeler via npm:
```
$> npm install --save @planqk/quantum-workflow-modeler
```

## Import and use the Quantum Workflow Modeler component
To use the Quantum Workflow Modeler component, import the index.js file from @planqk/quantum-workflow-modeler/public in
a script tag. This will add the ```quantum-workflow-modeler``` to the custom HTML tags of the page. Now you can use the
tag in your HTML code.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Workflow Modeler</title>
</head>
<body>
<div id="modeler-container" style="height: 100vh;">
    <quantum-workflow-modeler></quantum-workflow-modeler>
</div>
<script src="@planqk/quantum-workflow-modeler/public"></script>
</body>
```
