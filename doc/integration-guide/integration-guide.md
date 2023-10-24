# Guide to Integrate the Quantum Workflow Modeler
To integrate the modeler component into your application, follow the steps described in this guide.

## Set Up npm
The Quantum Workflow Modeler is published in the npm registry of GitHub Packages. To install it, you first need to configure your local npm setup. Add the following entry to the `.npmrc` file of your project or create one with the following entry:
```
@PlanQK:registry=https://npm.pkg.github.com
```
This will register the PlanQK namespace in your npm setup to access the organization under which the modeler package is published, as described in [this GitHub Packages Guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-a-package).

Now you need to [authenticate to GitHub Packages with npm](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token) by either editing your per-user `~/.npmrc` file to include your personal access token (replace TOKEN with your personal access token):
```
//npm.pkg.github.com/:_authToken=TOKEN
```
or by logging in to npm using your username and personal access token. Execute the following command:
```
npm login
```
Enter your GitHub username for `Username`, your personal access token for `Password`, and your email address associated with your GitHub account for `Email`:
```
Username: gitHubUser1234
Password: ghp_HJ45G2F6fsG7A67J8H5SFS9dfa6D86
Email: gitHubuser1234@gmail.com
```
Install the npm package for the Quantum Workflow Modeler:
```
npm install --save @planqk/quantum-workflow-modeler
```

## Enable Custom HTML Elements
Depending on your UI framework, you need to configure it to allow the usage of custom HTML elements. In this project, the modeler component was integrated into an [Angular](angular-integration.md), a [Vue.js](vue-integration.md), and a [plain HTML](html-integration.md) application for testing purposes. Guides for integrating the modeler into these UI frameworks can be found in this documentation. For integrating the modeler into other UI frameworks, you can search for '<name of your framework> using custom HTML elements' or something similar.

## Use the `quantum-workflow-modeler` Tag
Now you can use the custom HTML tag in your framework either directly as a tag in HTML or by using the tag of the component, `quantum-workflow-modeler`, directly in your HTML:
```html
<div id="modeler-container" 
     style="height: 100vh;
     border: solid 3px #EEE;
     position: relative;">
    <quantum-workflow-modeler></quantum-workflow-modeler>
</div>
```
or by creating the component manually using the document API:
```javascript
const modelerComponent = document.createElement('quantum-workflow-modeler');
```

## Configure Plugins
Activate the plugins you want to use in your instance of the modeler by setting the `pluginConfig` attribute:
```javascript
modelerComponent.pluginConfigs = [
    {
        name: "dataflow",
    },
    {
        name: "quantme",
    },
    {
        name: "planqk",
    },
    {
        name: "qhana",
    }
];
```

You can configure the plugins as described

 [here](../quantum-workflow-modeler/editor/plugin/plugin-config.md). The structure of the config is defined by the plugin and can be looked up in the documentation of the respective plugin.

You can add listeners to custom events that the Quantum Workflow Modeler triggers for changes in the currently loaded workflow, such as saving or loading a workflow. Read the [EventHandler documentation](../quantum-workflow-modeler/editor/events/event-handler-doc.md) to learn more about the events of the modeler.