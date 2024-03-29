import { createTempModeler } from "../../../modeler-component/editor/ModelerHandler";
import { setPluginConfig } from "../../../modeler-component/editor/plugin/PluginConfigHandler";
import { create as svgCreate } from "tiny-svg";
import { expect } from "chai";

const deploymentModelTopology = {
  topNode: {
    id: "RealWorld-Application-Backend_Java11-Spring-w1_0",
    documentation: [],
    any: [],
    otherAttributes: {
      "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}x": "390",
      "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}y": "112",
    },
    properties: {
      propertyType: "KV",
      namespace: "http://www.example.org",
      elementName: "Properties",
      kvproperties: { AppName: "", Port: "", context_root: "" },
    },
    type: "{http://opentosca.org/example/applications/nodetypes}RealWorld-Application-Backend_Java11-Spring-w1",
    name: "RealWorld-Application-Backend",
    minInstances: 1,
    maxInstances: "1",
    x: "390",
    y: "112",
  },
  nodeTemplates: [
    {
      id: "MariaDB_10-w1_0",
      documentation: [],
      any: [],
      otherAttributes: {
        "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}x": "657",
        "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}y": "450",
      },
      properties: {
        propertyType: "KV",
        namespace: "http://opentosca.org/nodetypes/propertiesdefinition/winery",
        elementName: "properties",
        kvproperties: { DBName: "", DBUser: "", DBPassword: "" },
      },
      type: "{http://opentosca.org/nodetypes}MariaDB_10-w1",
      name: "MariaDB",
      minInstances: 1,
      maxInstances: "1",
      x: "657",
      y: "450",
    },
    {
      id: "Java_11-w1_0",
      documentation: [],
      any: [],
      otherAttributes: {
        "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}x": "352",
        "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}y": "281",
      },
      properties: {
        propertyType: "KV",
        namespace: "http://www.example.org",
        elementName: "Properties",
        kvproperties: { component_version: "", admin_credential: "" },
      },
      type: "{http://opentosca.org/nodetypes}Java_11-w1",
      name: "Java",
      minInstances: 1,
      maxInstances: "1",
      x: "352",
      y: "281",
    },
    {
      id: "Ubuntu-VM_18.04-w1_0",
      documentation: [],
      any: [],
      otherAttributes: {
        "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}x": "390",
        "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}y": "619",
      },
      properties: {
        propertyType: "KV",
        namespace: "http://opentosca.org/nodetypes",
        elementName: "VirtualMachineProperties",
        kvproperties: {
          instanceRef: "",
          VMIP: "",
          VMInstanceID: "",
          VMType: "",
          VMUserName: "",
          VMUserPassword: "",
          VMPrivateKey: "",
          VMPublicKey: "",
          VMKeyPairName: "",
        },
      },
      type: "{http://opentosca.org/nodetypes}Ubuntu-VM_18.04-w1",
      name: "Ubuntu-VM",
      minInstances: 1,
      maxInstances: "1",
      x: "390",
      y: "619",
    },
    {
      id: "DockerContainer_w1_0",
      documentation: [],
      any: [],
      otherAttributes: {
        "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}x": "352",
        "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}y": "450",
      },
      properties: {
        propertyType: "KV",
        namespace: "http://opentosca.org/nodetypes/properties",
        elementName: "properties",
        kvproperties: {
          Port: "",
          ContainerPort: "",
          ContainerID: "",
          ContainerIP: "",
          ImageID: "",
          ContainerMountPath: "",
          HostMountFiles: "",
          PrivilegedMode: "",
        },
      },
      type: "{http://opentosca.org/nodetypes}DockerContainer_w1",
      name: "DockerContainer_w1",
      minInstances: 1,
      maxInstances: "1",
      x: "352",
      y: "450",
    },
    {
      id: "RealWorld-Application-Backend_Java11-Spring-w1_0",
      documentation: [],
      any: [],
      otherAttributes: {
        "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}x": "390",
        "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}y": "112",
      },
      properties: {
        propertyType: "KV",
        namespace: "http://www.example.org",
        elementName: "Properties",
        kvproperties: { AppName: "", Port: "", context_root: "" },
      },
      type: "{http://opentosca.org/example/applications/nodetypes}RealWorld-Application-Backend_Java11-Spring-w1",
      name: "RealWorld-Application-Backend",
      minInstances: 1,
      maxInstances: "1",
      x: "390",
      y: "112",
    },
    {
      id: "AWS_w1_0",
      documentation: [],
      any: [],
      otherAttributes: {
        "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}x": "390",
        "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}y": "788",
      },
      properties: {
        propertyType: "KV",
        namespace: "http://opentosca.org/nodetypes",
        elementName: "AWS_w1",
        kvproperties: {
          AWS_ACCESS_KEY_ID: "",
          AWS_SECRET_ACCESS_KEY: "",
          AWS_REGION: "",
        },
      },
      type: "{http://opentosca.org/nodetypes}AWS_w1",
      name: "AWS_w1",
      minInstances: 1,
      maxInstances: "1",
      x: "390",
      y: "788",
    },
  ],
  relationshipTemplates: [
    {
      id: "con_AttachesTo_0",
      documentation: [],
      any: [],
      otherAttributes: {},
      type: "{http://docs.oasis-open.org/tosca/ToscaNormativeTypes/relationshiptypes}AttachesTo",
      sourceElement: { ref: "MariaDB_10-w1_0" },
      targetElement: { ref: "Ubuntu-VM_18.04-w1_0" },
      name: "AttachesTo",
    },
    {
      id: "con_HostedOn_0",
      documentation: [],
      any: [],
      otherAttributes: {},
      type: "{http://docs.oasis-open.org/tosca/ns/2011/12/ToscaBaseTypes}HostedOn",
      sourceElement: { ref: "DockerContainer_w1_0" },
      targetElement: { ref: "Ubuntu-VM_18.04-w1_0" },
      name: "HostedOn",
    },
    {
      id: "con_HostedOn_1",
      documentation: [],
      any: [],
      otherAttributes: {},
      type: "{http://docs.oasis-open.org/tosca/ns/2011/12/ToscaBaseTypes}HostedOn",
      sourceElement: { ref: "Java_11-w1_0" },
      targetElement: { ref: "DockerContainer_w1_0" },
      name: "HostedOn",
    },
    {
      id: "con_HostedOn_2",
      documentation: [],
      any: [],
      otherAttributes: {},
      type: "{http://docs.oasis-open.org/tosca/ns/2011/12/ToscaBaseTypes}HostedOn",
      sourceElement: {
        ref: "RealWorld-Application-Backend_Java11-Spring-w1_0",
      },
      targetElement: { ref: "Java_11-w1_0" },
      name: "HostedOn",
    },
    {
      id: "con_HostedOn_3",
      documentation: [],
      any: [],
      otherAttributes: {},
      type: "{http://docs.oasis-open.org/tosca/ns/2011/12/ToscaBaseTypes}HostedOn",
      sourceElement: { ref: "Ubuntu-VM_18.04-w1_0" },
      targetElement: { ref: "AWS_w1_0" },
      name: "HostedOn",
    },
    {
      id: "con_ConnectsTo_0",
      documentation: [],
      any: [],
      otherAttributes: {},
      properties: {
        propertyType: "KV",
        namespace:
          "http://docs.oasis-open.org/tosca/ns/2011/12/ToscaBaseTypes/propertiesdefinition/winery",
        elementName: "properties",
        kvproperties: { ChannelType: "" },
      },
      type: "{http://docs.oasis-open.org/tosca/ns/2011/12/ToscaBaseTypes}ConnectsTo",
      sourceElement: { ref: "Java_11-w1_0" },
      targetElement: { ref: "MariaDB_10-w1_0" },
      name: "ConnectsTo",
    },
  ],
};

describe("Test the OpenTosca renderer", function () {
  it("Should render deployment model", () => {
    setPluginConfig([
      {
        name: "opentosca",
        config: {
          test: "test",
        },
      },
    ]);
    const modeler = createTempModeler();
    const renderer = modeler.get("openToscaRenderer");
    const loadedDeploymentModelUrl = "moz://a";

    const parentGfx = svgCreate("g");

    renderer.showDeploymentModel(
      parentGfx,
      {
        loadedDeploymentModelUrl,
        deploymentModelTopology,
      },
      loadedDeploymentModelUrl
    );

    expect(parentGfx.innerHTML).to.contain('<g id="deployment">');
  });
});
