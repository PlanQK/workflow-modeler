# Installation Guide

## Example Setup
To use all features of the modeler, several backend services have to be available. An example docker setup to use the features of the QuantME plugin is available in the [QuantME-UseCase Repository](https://github.com/UST-QuAntiL/QuantME-UseCases/tree/master/2022-sncs) under the '2022-sncs' directory on Github. Follow the installation instructions to start the setup. If the docker setup is not on the same machine as the modeler, the camunda container of the docker setup will not work properly, because of CORS errors. 

To be able to deploy the modelled workflows without any errors to the Camunda workflow enigne, install [Camunda Run Community Edition](https://camunda.com/download/) on your machine and start it. It will run per default on port 8080. To avoid conflicts with the above docker setup, stop the 'camunda-engine' container.

With this setup, all features of the modeler can be used properly.

