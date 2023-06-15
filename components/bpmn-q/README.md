# Quantum Workflow Modeler - HTML Web Component

This project contains the HTML web component for the Quantum Workflow Modeler and its implementation.

## Node Version

The project was created with npm 8.19.2 and node 18.12.1.

## Development Setup

To set this project up for development clone the repository and open it in your favorite editor.

Execute the following commands under this directory:

### Install dependencies

```
npm install
```

### Start the Modeler

To execute the Quantum Workflow Modeler, a small test website can be run which only contains the modeler component.
To start this website, execute

```
npm run dev
```

This will start a webpack dev server which loads the website specified in the [index.html file](components/bpmn-q/public/index.html)

### Build the Modeler

To build the modeler execute

```
npm run build
```

This will build the modeler component with webpack into a single js file in the [public directory](components/bpmn-q/public).

### Run all Tests

To execute all tests run

```
npm test
```

This will run all mocha test specified in [karma.conf.js](components/bpmn-q/karma.conf.js) with karma.

### External Endpoints

Some components of the modeler component need external endpoints to work properly. Refer to [this guide](doc/devloper-setup/developer-setup.md)
for setting up all used endpoints.

## Disclaimer of Warranty

Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its
Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including,
without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR
PURPOSE.
You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks
associated with Your exercise of permissions under this License.

## Haftungsausschluss

Dies ist ein Forschungsprototyp.
Die Haftung für entgangenen Gewinn, Produktionsausfall, Betriebsunterbrechung, entgangene Nutzungen, Verlust von Daten
und Informationen, Finanzierungsaufwendungen sowie sonstige Vermögens- und Folgeschäden ist, außer in Fällen von grober
Fahrlässigkeit, Vorsatz und Personenschäden, ausgeschlossen.
