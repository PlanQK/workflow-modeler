<template>
  <div style="height: 78vh; min-height: 85%">
    <quantum-workflow-modeler ref="modelerComponent"></quantum-workflow-modeler>
  </div>
</template>
<script setup>
// import "@planqk/quantum-workflow-modeler/public";
// import "@planqk/quantum-workflow-modeler/public/modeler-styles.css";

// direct import for fast testing of new features
import "../../../bpmn-q/public/";
// import "../../../bpmn-q/public/modeler-styles.css";
</script>
<script>
export default {
  name: "QFlowModeler",

  mounted() {
    const app1 = {
      id: "app1",
      description: "",
      attributes: null,
      groups: [],
      name: "Seppones App",
      subscriptionCount: 2,
    };
    const api1 = {
      id: "api1",
      name: "Seppones API",
      gatewayEndpoint: "www.seppone-gateway.de/api1",
      version: "v1",
      context: "/api1",
    };
    const api2 = {
      id: "api2",
      name: "Felixs API",
      gatewayEndpoint: "www.felix-gateway.de/api1",
      version: "v1",
      context: "/api1",
    };
    const sub1 = { id: "sub1", application: app1, api: api1 };
    const sub2 = { id: "sub2", application: app1, api: api2 };
    const app2 = {
      id: "app2",
      description: "",
      attributes: null,
      groups: [],
      name: "Falkis App",
      subscriptionCount: 1,
    };
    const api3 = {
      id: "api3",
      name: "Wuddis API",
      gatewayEndpoint: "www.wuddi-gateway.de/api1",
      version: "v1",
      context: "/api3",
    };
    const sub3 = { id: "sub3", application: app2, api: api3 };

    const dp1 = {
      name: "Anomaly Detection: Bars & Stipes Dataset ",
      id: "2a7d74a6-0fb5-400a-8f0c-7125aef5613e",
      link: "https://platform.planqk.de/datapools/2a7d74a6-0fb5-400a-8f0c-7125aef5613e/",
      description:
        "A synthetic dataset for the anomaly detection. There are two version of the dataset, a larger version consisting of 3x3 pixel images of bars and stripes and a small version of 2x2 pixel images. We provide pretrained models for both of these datasets to be used with the AnoGan service.",
    };
    const dp2 = {
      name: "Infinite Data Pool",
      id: "2a7d74a6-0fb5-400a-asd3-7125aef5613e",
      link: "https://platform.planqk.de/datapools/2a7d74a6-0fb5-400a-asd3-7125aef5613e/",
      description:
        "A dataset with an infinite amount of data to train endless models.",
    };
    const dp3 = {
      name: "Small Data Pool",
      id: "2a7d74a6-adsa-400a-8f0c-7125aef5613e",
      link: "https://platform.planqk.de/datapools/2a7d74a6-adsa-400a-8f0c-7125aef5613e/",
      description: "Replace this by a real description",
    };

    const modelerComponent = this.$refs.modelerComponent;
    modelerComponent.pluginConfigs = [
      {
        name: "planqk",
        config: {
          serviceEndpointBaseUrl: "http://dummy.com",
          subscriptions: [sub1, sub2, sub3],
          oauthInfoByAppMap: {
            app1: {
              consumerKey: "app1ConsumerKey",
              consumerSecret: "app1ConsumerSecret",
            },
            app2: {
              consumerKey: "app2ConsumerKey",
              consumerSecret: "app2ConsumerSecret",
            },
          },
          dataPools: [dp1, dp2, dp3],
        },
      },
      {
        name: "quantme",
        config: {
          test: "test",
        },
      },
      {
        name: "qhana",
      },
      {
        name: "dataflow",
      },
    ];
  },
};
</script>
