# Integrating the Modeler into an Angular Application
To integrate the modeler component into an application built with the Angular framework, you have to follow these steps:

## Install npm Package
Register the PlanQK npm namespace and authenticate yourself to GitHub Packages, as described in [the integration guide](integration-guide.md). 
Install the npm package of the Quantum Workflow modeler via npm:
```
$> npm install --save @planqk/quantum-workflow-modeler
```

## Activate Custom Elements Schema
Enable the use of custom HTML elements by adding CUSTOM_ELEMENTS_SCHEMA from angular core to your module schemas. This will allow
you to use custom HTML elements in the current angular module.

```typescript
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';


@NgModule({
  // ...
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
```

## Import the Quantum Workflow Modeler
Import the Quantum Workflow Modeler component in the component you want to use it in. 
```typescript
import {Component, ElementRef, OnInit, ViewEncapsulation} from '@angular/core';
import '@planqk/quantum-workflow-modeler/public';

@Component({...})
export class AppComponent implements OnInit { ... }
```

## Use the Component
use the modeler component via its tag in your html file of the component you imported the modeler package in.
```html
<div style="display: flex; height: 100%">
    ...
    <quantum-workflow-modeler></quantum-workflow>
    ...
</div>
```