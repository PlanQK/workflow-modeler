# Environment Variables

In the following, all environment variables that can be used to customize the workflow modeler are summarized.

### Overview

* ```AWS_RUNTIME_HANDLER_ENDPOINT``` (default 'http://localhost:8890'): Defines the endpoint of the [Amazon Braket Hybrid Jobs Handler](https://github.com/UST-QuAntiL/amazon-braket-hybrid-jobs-handler) which enables the automatic generation of hybrid programs from Amazon Braket programs.

* ```CAMUNDA_ENDPOINT``` (default: 'http://localhost:8080/engine-rest'): Defines the endpoint of the Camunda engine to deploy workflows to.
           
* ```DATA_CONFIG``` (default: 'http://localhost:8100/data-objects'): Defines the configuration of data objects.

* ```DOWNLOAD_FILE_NAME``` (default: 'quantum-workflow-model'): Defines the name of the download file.

* ```ENABLE_DATA_FLOW_PLUGIN``` (default: 'true'): Defines if the Data Flow plugin is enabled.

* ```ENABLE_PATTERN_PLUGIN``` (default: 'true'): Defines if the Pattern plugin is enabled.

* ```ENABLE_PLANQK_PLUGIN``` (default: 'true'): Defines if the PlanQK plugin is enabled.

* ```ENABLE_QHANA_PLUGIN``` (default: 'true'): Defines if the QHAna plugin is enabled.

* ```ENABLE_QUANTME_PLUGIN``` (default: 'true'): Defines if the QuantME plugin is enabled.

* ```GITHUB_TOKEN``` (default: ''): Defines the GitHub Token which can be used to make authorized requests. For more information take a look at [GitHub Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

* ```AUTOSAVE_INTERVAL``` (default ms: '300000'): Defines the interval of the auto save feature. If changes are applied to the workflow then it get saved after `5` minutes. 

* ```NISQ_ANALYZER_ENDPOINT``` (default: 'http://localhost:8098/nisq-analyzer'): Defines the endpoint of the [NISQ Analyzer](https://github.com/UST-QuAntiL/nisq-analyzer) to enable an automated hardware selection.

* ```OPENTOSCA_ENDPOINT``` (default: 'http://localhost:1337/csars'): Defines the endpoint of the OpenTOSCA container to deploy services with.

* ```PATTERN_ATLAS_ENDPOINT``` (default: 'http://localhost:1977/patternatlas/patternLanguages/af7780d5-1f97-4536-8da7-4194b093ab1d'): Defines the endpoint of the Pattern Atlas.

* ```PATTERN_ATLAS_UI_ENDPOINT``` (default: 'http://localhost:1978'): Defines the endpoint of the Pattern Atlas UI.

* ```QC_ATLAS_ENDPOINT``` (default: 'http://localhost:6626'): Defines the endpoint of the QC Atlas.

* ```QISKIT_RUNTIME_HANDLER_ENDPOINT``` (default: 'http://localhost:8889'): Defines the endpoint of the [Qiskit Runtime Handler](https://github.com/UST-QuAntiL/qiskit-runtime-handler) which enables the automatic generation of hybrid programs from Qiskit programs.

* ```QHANA_PLUGIN_REGISTRY_URL``` (default: 'http://localhost:5006/api/'): Defines the url of the plugin registry api for QHAna.

* ```QProv_ENDPOINT``` (default: 'http://localhost:8099/qprov'): Defines the endpoint of [QProv](https://github.com/UST-QuAntiL/qprov) to store and retrieve provenance data.

* ```QRM_USERNAME``` (default: ' '): Defines the GitHub username to access the [QRM-Repository](../QRM-Repository)

* ```QRM_REPONAME``` (default: ' '): Defines the GitHub repository name to access the [QRM-Repository](../QRM-Repository)

* ```QRM_REPOPATH``` (default: ' '): Defines the local path in the GitHub repository to the folder containing the [QRM-Repository](../QRM-Repository). This parameter is optional and if it is not set, the root folder of the repository is used.

* ```SERVICE_DATA_CONFIG``` (default: 'http://localhost:8000/service-task'): Defines the configuration for the service task.

* ```SCRIPT_SPLITTER_EDNPOINT``` (default: 'http://localhost:8891'): Defines the endpoint of the Script Splitter.

* ```SCRIPT_SPLITTER_THRESHOLD``` (default: '5'): Defines the splitting threshold for the Script Splitter.

* ```TRANSFORMATION_FRAMEWORK_ENDPOINT``` (default: 'http://localhost:8888'): Defines the endpoint of the QuantME Transformation Framework to use for the automated hardware selection.

* ```UPLOAD_BRANCH_NAME``` (default: ' '): Defines the branch name where the workflow will be uploaded.

* ```UPLOAD_FILE_NAME``` (default: ' '): Defines the name of the workflow file which will be uploaded.

* ```UPLOAD_GITHUB_REPO``` (default: ' '): Defines the repository for the file upload.

* ```UPLOAD_GITHUB_USER``` (default: ' '): Defines the owner for the upload repository.

* ```WINERY_ENDPOINT``` (default: 'http://localhost:8081/winery'): Defines the endpoint of the Winery to retrieve deployment models for services from.

* ```PROVENANCE_COLLECTION``` (default: 'false'): Defines if the intermediate results of the workflow executed should be collected.

The value of an environment variable is accessed using `process.env.ENV_NAME`.
If you want to add a new environment variable, add it to the [webpack.config.js](../../components/bpmn-q/webpack.config.js) file and also to [env.js.template](../../components/bpmn-q/public/env.js.template) so that it works in the docker image.
