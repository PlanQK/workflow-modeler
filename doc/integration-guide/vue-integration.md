# Integrating the Modeler into a Vue-js Application
To integrate the modeler component into an application built with the Vue-js framework, you have to follow these steps:

## Install npm Package
Register the PlanQK npm namespace and authenticate yourself to GitHub Packages, as described in [the integration guide](integration-guide.md).
Install the npm package of the Quantum Workflow modeler via npm:
```
$> npm install --save @planqk/quantum-workflow-modeler
```

## Activate Custom Elements
Enable the use of custom HTML elements by adding a new plugin to your vite.config.js. If you do not use vite you have to
google how to activate custom HTML elements for your packaging library, but it may work similar:
```javascript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    ...
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes("-"),
        },
      },
    }),
  ],
    ...
});
```

## Import the Quantum Workflow Modeler
Import the Quantum Workflow Modeler component and use the tag ```quantum-workflow-modeler``` in the Vue file you want to
use the modeler in.
```javascript
<template>
    <div style="height: 78vh; min-height: 85%">
        <quantum-workflow-modeler ref="modelerComponent"></quantum-workflow-modeler>
    </div>
</template>
<script setup>
import "@planqk/quantum-workflow-modeler/public";
    
</script>
```