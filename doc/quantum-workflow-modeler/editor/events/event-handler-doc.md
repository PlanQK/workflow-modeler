# Workflow Events

The Quantum Workflow Modeler dispatches [Custom HTML Events](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events)
when the workflow of the modeler changes. The event types the modeler creates are defined in [workflowEventTypes](../../../../components/bpmn-q/modeler-component/editor/EditorConstants.js)
Currently four Events are dispatched:

- REQUEST_OPEN: ('quantum-workflow-request-open'), when the editor is about to open a file (cancelable)
- LOADED: ('quantum-workflow-loaded'), when a new workflow is loaded in modeler
- BEFORE_SAVE: ('quantum-workflow-before-save'), when the editor is about to save a file (cancelable)
- SAVED: ('quantum-workflow-saved'), when a workflow is saved 
- TRANSFORMED: ('quantum-workflow-transformed'), when a workflow was transformed, before loading the transformed workflow (cancelable)
- BEFORE_DEPLOY: ('quantum-workflow-before-deploy'), when the editor is about to deploy the workflow (cancelable)
- DEPLOYED: ('quantum-workflow-deployed'), when a workflow was deployed to the workflow engine

Each Event (except for 'quantum-workflow-request-open' events) contains the workflow as xml string and the file name of the current workflow as entries of detail. The event 
is structured like this:
````javascript
const newEvent = new CustomEvent(type, {
    detail: {
        workflowName: workflowName, // name of the current loaded workflow
        workflow: workflowXml // the currently loaded workflow as an xml string
        // additional details depending on event type
    },
    cancelable: true
});
````

Some events are marked as cancelable. Those events can be used to change the default behaviour of the quantum workflow modeler component from outside.
To prevent the default behaviour call `event.preventDefault()` on the cancelable event.


## Event Handler

The dispatching of the events are controlled by the [EditorEventHandler](../../../../components/bpmn-q/modeler-component/editor/events/EditorEventHandler.js).
Use this class to dispatch a workflow Event via the ```dispatchWorkflowEvent()``` function or add a listener for the 
workflow events with ````addWorkflowEventListener()````.

The workflow events can be used to also handle the changes of the workflow in the web app which integrates the modeler. Therefore,
the can register an event listener on the modeler component to catch the workflow events, like in the following example:
````javascript
const modelerComponent = document.querySelector('quantum-workflow-modeler');

modelerComponent.addEventListener('quantum-workflow-loaded', (event) => {
    console.log('------------------------------------------------');
    console.log('Received loaded quantum workflow ' + event.detail.workflowName + ':')
    console.log('------------------------------------------------');

}, false);
````

You can control the handling of the transformed workflow by your application instead by the modeler. Therefore, you register a listener
for the ````quantum-workflow-transformed```` event and call ````preventDefault()```` on the event. The modeler will recognize that and will not handle the transformed 
workflow. The following example shows how to do that:
````javascript
modelerComponent.addEventListener('quantum-workflow-transformed', (event) => {
    event.preventDefault();

    const name = event.detail.workflowName;
    const workflow = event.detail.workflow;

    // handle transformed workflow
    
});
````
