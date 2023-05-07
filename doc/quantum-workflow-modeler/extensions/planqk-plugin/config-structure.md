# Structure of the config for the PlanQK Plugin
The config attribute of the PlanQK Plugin must have the following structure:

```javascript
const app1 = {
    id: 'app1',
    description: '',
    attributes: null,
    groups: [],
    name: 'Example App',
    subscriptionCount: 2
};
const api1 = {
    id: 'api1',
    name: 'Example API',
    gatewayEndpoint: 'www.example-gateway.de/api1',
    version: 'v1',
    context: '/api1'
};
const sub1 = {id: 'sub1', application: app1, api: api1};

const dp1 = {
    name: 'Anomaly Detection: Bars & Stipes Dataset ',
    id: '2a7d74a6-0fb5-400a-8f0c-7125aef5613e',
    link: 'https://platform.planqk.de/datapools/2a7d74a6-0fb5-400a-8f0c-7125aef5613e/',
    description: 'A synthetic dataset for the anomaly detection. There are two version of the dataset, a larger version consisting of 3x3 pixel images of bars and stripes and a small version of 2x2 pixel images. We provide pretrained models for both of these datasets to be used with the AnoGan service.',
};

const modelerComponent = document.querySelector('quantum-workflow');
modelerComponent.pluginConfigs = [
    ...
    {
        name: 'planqk',
        config: {
            serviceEndpointBaseUrl: 'http://dummy.com',
            subscriptions: [sub1],
            oauthInfoByAppMap: {
                app1: {consumerKey: 'app1ConsumerKey', consumerSecret: 'app1ConsumerSecret'},
            },
            dataPools: [dp1],
        }
    },
    // ...
]
```

| Entry Name | Description                                                                                                                         |
| -------- |-------------------------------------------------------------------------------------------------------------------------------------|
| serviceEndpointBaseUrl | Base URL pointing to the endpoint for PlanQK services                                                                               |
| subscriptions | Array of subsriptions for PlanQK Services                                                                                           |
| oauthInfoByAppMap | Consumer key and consumer secret of PlanQK applications                                                                             |
| dataPools | Array PlanQK data pools. Each data pool consists of a name, an id, a link to the data pool on the PlanQK platform and a description |