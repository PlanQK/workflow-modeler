import React, { PureComponent } from 'react';

export default class DeploymentButton extends PureComponent {

    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }

    async deployModel() {

        console.log('deploy currently opened model')

        const { bpmnJS } = this.props;

        const xml = ( await bpmnJS.saveXML()).xml;

        // Create a new FormData object
        // const formData = new FormData();
        // formData.append('name', 'My Process');
        // formData.append('deployment-source', new Blob([bpmnXml], { type: 'text/xml' }), 'diagram.bpmn');
        const bpmnFile = new File([xml], 'quantum-model.bpmn', {type: 'text/xml'});

        // Erstelle ein FormData-Objekt und füge die Datei hinzu
        const formData = new FormData();
        // formData.append('name', 'MyProcess')
        formData.append('deployment-name', 'Quantum Model');
        formData.append('deployment-source', 'Quantum Workflow Modeler');
        formData.append('data', bpmnFile);
        //////////////////////////////////////////////////////////////////////////////////////////////////
        // TODO: Current Problem: Process is received by the camunda Platform and parsed correctly, but there is
        // no Process Definition, maybe because the sent model is not properly configured for the workflow engine
        // check set up for process execution: https://docs.camunda.org/get-started/quick-start/service-task/
        // camunda platform 7 rest api: https://docs.camunda.org/manual/7.18/reference/rest/deployment/post-deployment/
        //////////////////////////////////////////////////////////////////////////////////////////////////

        // Sende eine POST-Anfrage an die Camunda Rest API, um das Modell zu deployen
        fetch('http://localhost:8080/engine-rest/deployment/create', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json().then(function (result) {
                console.log(result)
            }))
            .then(data => console.log(data))
            .catch(error => console.error(error))
    }

    render() {
        return (<button style={{flex: 1}} title="Deploy" onClick={() => this.deployModel()}>Deployment</button>)
    }
}