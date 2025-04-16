/**
 * Copyright (c) 2024 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as config from "../framework-config/config-manager";
import { getWineryEndpoint } from "../framework-config/config-manager";
import { fetch } from "whatwg-fetch";
import { createNewArtifactTemplate } from "./OpenTOSCAUtils";

const QUANTME_NAMESPACE_PUSH = "http://quantil.org/quantme/push";

const nodeTypeDefinition = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Definitions targetNamespace="http://opentosca.org/nodetypes" id="winery-defs-for_otntyIgeneral-NodetypeToReplace" xmlns="http://docs.oasis-open.org/tosca/ns/2011/12" xmlns:yml="http://docs.oasis-open.org/tosca/ns/simple/yaml/1.3" xmlns:selfservice="http://www.eclipse.org/winery/model/selfservice" xmlns:winery="http://www.opentosca.org/winery/extensions/tosca/2013/02/12" xmlns:researchobject="http://www.eclipse.org/winery/model/researchobject" xmlns:testwineryopentoscaorg="http://test.winery.opentosca.org">
    <NodeType name="NodetypeToReplaceContainer" abstract="no" final="no" targetNamespace="http://opentosca.org/nodetypes">
        <DerivedFrom typeRef="nodetypes:DockerContainer" xmlns:nodetypes="http://opentosca.org/nodetypes"/>
        <winery:PropertiesDefinition elementname="Properties" namespace="http://opentosca.org/nodetypes/propertiesdefinition/winery">
            <winery:properties>
                <winery:key>ContainerPort</winery:key>
                <winery:type>xsd:string</winery:type>
            </winery:properties>
            <winery:properties>
                <winery:key>Port</winery:key>
                <winery:type>xsd:string</winery:type>
            </winery:properties>
            <winery:properties>
                <winery:key>ENV_CAMUNDA_ENDPOINT</winery:key>
                <winery:type>xsd:string</winery:type>
            </winery:properties>
            <winery:properties>
                <winery:key>ENV_CAMUNDA_TOPIC</winery:key>
            </winery:properties>
        </winery:PropertiesDefinition>
    </NodeType>
</Definitions>`;

const topologyTemplateDefinition = `<Definitions targetNamespace="http://quantil.org/quantme/pull" id="winery-defs-for_pull-NodetypeToReplace" xmlns="http://docs.oasis-open.org/tosca/ns/2011/12" xmlns:yml="http://docs.oasis-open.org/tosca/ns/simple/yaml/1.3" xmlns:selfservice="http://www.eclipse.org/winery/model/selfservice" xmlns:winery="http://www.opentosca.org/winery/extensions/tosca/2013/02/12" xmlns:researchobject="http://www.eclipse.org/winery/model/researchobject" xmlns:testwineryopentoscaorg="http://test.winery.opentosca.org">
    <ServiceTemplate name="NodetypeToReplace" targetNamespace="http://quantil.org/quantme/pull" id="NodetypeToReplace">
        <TopologyTemplate>
            <NodeTemplate name="DockerEngine" minInstances="1" maxInstances="1" type="nodetypes:DockerEngine" id="DockerEngine_0" winery:x="779" winery:y="294" xmlns:nodetypes="http://opentosca.org/nodetypes">
                <Properties>
                    <otntyIproperties:DockerEngine_Properties xmlns:otntyIproperties="http://opentosca.org/nodetypes/properties">
                        <otntyIproperties:DockerEngineURL>tcp://dind:2375</otntyIproperties:DockerEngineURL>
                        <otntyIproperties:DockerEngineCertificate/>
                        <otntyIproperties:State>Running</otntyIproperties:State>
                    </otntyIproperties:DockerEngine_Properties>
                </Properties>
            </NodeTemplate>
            <NodeTemplate name="NodetypeToReplaceContainer" minInstances="1" maxInstances="1" type="nodetypes:NodetypeToReplaceContainer" id="NodetypeToReplaceContainer_0" winery:x="775" winery:y="102" xmlns:nodetypes="http://opentosca.org/nodetypes">
                <Properties>
                    <otntypdInodetypes:Properties xmlns:otntypdInodetypes="http://opentosca.org/nodetypes/propertiesdefinition/winery">
                        <otntypdInodetypes:Port/>
                        <otntypdInodetypes:ContainerPort>80</otntypdInodetypes:ContainerPort>
                        <otntypdInodetypes:ContainerID/>
                        <otntypdInodetypes:ContainerIP/>
                        <otntypdInodetypes:ENV_CAMUNDA_ENDPOINT>get_input: camundaEndpoint</otntypdInodetypes:ENV_CAMUNDA_ENDPOINT>
                        <otntypdInodetypes:ENV_CAMUNDA_TOPIC>get_input: camundaTopic</otntypdInodetypes:ENV_CAMUNDA_TOPIC>
                    </otntypdInodetypes:Properties>
                </Properties>
                <DeploymentArtifacts>
                    <DeploymentArtifact name="NodetypeToReplace_DA" artifactType="artifacttypes:DockerContainerArtifact" artifactRef="artifacttemplates:NodetypeToReplace_DA" xmlns:artifacttemplates="http://opentosca.org/artifacttemplates" xmlns:artifacttypes="http://opentosca.org/artifacttypes"/>
                </DeploymentArtifacts>
            </NodeTemplate>
            <RelationshipTemplate name="HostedOn" type="ToscaBaseTypes:HostedOn" id="con_HostedOn_0" xmlns:ToscaBaseTypes="http://docs.oasis-open.org/tosca/ns/2011/12/ToscaBaseTypes">
                <SourceElement ref="NodetypeToReplaceContainer_0"/>
                <TargetElement ref="DockerEngine_0"/>
            </RelationshipTemplate>
        </TopologyTemplate>
    </ServiceTemplate>
</Definitions>`;

export async function createArtifactTemplate(name, artifactTypeQName) {
  const artifactTemplate = {
    localname: name,
    namespace: QUANTME_NAMESPACE_PUSH + "/artifacttemplates",
    type: artifactTypeQName,
  };
  const response = await fetch(`${getWineryEndpoint()}/artifacttemplates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/plain",
    },
    body: JSON.stringify(artifactTemplate),
  });
  return response.text();
}

export async function addFileToArtifactTemplate(artifactTemplateAddress, file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(
    `${getWineryEndpoint()}/artifacttemplates/${artifactTemplateAddress}files`,
    {
      method: "POST",
      body: formData,
      headers: {
        Accept: "*/*",
      },
    }
  );
  return response.json();
}

export async function createArtifactTemplateWithFile(name, artifactType, file) {
  const artifactTemplateAddress = await createArtifactTemplate(
    name,
    artifactType
  );
  await addFileToArtifactTemplate(artifactTemplateAddress, file);
  return artifactTemplateAddress;
}

export async function createServiceTemplate(name, namespace) {
  console.log("create service template with name ", name);
  const serviceTemplate = {
    localname: name,
    namespace: namespace,
  };
  const response = await fetch(getWineryEndpoint() + "/servicetemplates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/plain",
    },
    body: JSON.stringify(serviceTemplate),
  });
  return response.text();
}

export async function deleteArtifactTemplate(artifactTemplateName) {
  // /artifacttemplates/http%253A%252F%252Fquantil.org%252Fquantme%252Fpush%252Fartifacttemplates/ArtifactTemplate-Activity_01b3qkz/
  const response = await fetch(
    `${getWineryEndpoint()}/artifacttemplates/${encodeURIComponent(
      encodeURIComponent(QUANTME_NAMESPACE_PUSH + "/")
    )}artifacttemplates/${encodeURIComponent(
      encodeURIComponent(artifactTemplateName)
    )}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    }
  );
  return response.status === 204;
}

export async function serviceTemplateExists(serviceTemplateName) {
  const response = await fetch(
    `${getWineryEndpoint()}/servicetemplates/${encodeURIComponent(
      encodeURIComponent(QUANTME_NAMESPACE_PUSH)
    )}/${encodeURIComponent(encodeURIComponent(serviceTemplateName))}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );
  return response.status === 200;
}

export async function deleteTagByID(serviceTemplateAddress, tagID) {
  const response = await fetch(
    `${getWineryEndpoint()}/servicetemplates/${serviceTemplateAddress}tags/${tagID}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    }
  );
  return response.status === 204;
}

export async function getTags(serviceTemplateAddress) {
  const response = await fetch(
    `${getWineryEndpoint()}/servicetemplates/${serviceTemplateAddress}tags/`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );
  return response.json();
}

export async function deleteTopNodeTag(serviceTemplateAddress) {
  const tags = await getTags(serviceTemplateAddress);
  const topNodeTag = tags.find((tag) => tag.name === "top-node");
  if (topNodeTag) {
    return deleteTagByID(serviceTemplateAddress, topNodeTag.id);
  }
  return true;
}

export async function addNodeWithArtifactToServiceTemplateByName(
  serviceTemplateName,
  nodeTypeQName,
  name,
  artifactTemplateQName,
  artifactName,
  artifactTypeQName
) {
  const serviceTemplateAddress =
    encodeURIComponent(encodeURIComponent(QUANTME_NAMESPACE_PUSH)) +
    "/" +
    encodeURIComponent(encodeURIComponent(serviceTemplateName)) +
    "/";
  await addNodeWithArtifactToServiceTemplate(
    serviceTemplateAddress,
    nodeTypeQName,
    name,
    artifactTemplateQName,
    artifactName,
    artifactTypeQName
  );
  return serviceTemplateAddress;
}

export async function addNodeToServiceTemplate(
  serviceTemplateAddress,
  nodeTypeQName,
  name
) {
  const nodeTemplate = {
    documentation: [],
    any: [],
    otherAttributes: {},
    relationshipTemplates: [],
    nodeTemplates: [
      {
        documentation: [],
        any: [],
        otherAttributes: {
          "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}x": 1245,
          "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}y": 350,
        },
        properties: {
          propertyType: "KV",
          kvproperties: {
            Port: "",
            Name: "",
          },
          elementName: "properties",
          namespace:
            "http://opentosca.org/nodetypes/propertiesdefinition/winery",
        },
        id: nodeTypeQName.split(/}(.*)/s)[1],
        type: nodeTypeQName,
        name: name,
        minInstances: 1,
        maxInstances: 1,
        x: 1245,
        y: 350,
        capabilities: [],
        requirements: [],
        deploymentArtifacts: null,
        policies: null,
      },
    ],
  };
  const response = await fetch(
    `${getWineryEndpoint()}/servicetemplates/${serviceTemplateAddress}topologytemplate`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(nodeTemplate),
    }
  );
  return response.status === 204;
}

export async function addNodeWithArtifactToServiceTemplate(
  serviceTemplateAddress,
  nodeTypeQName,
  name,
  artifactTemplateQName,
  artifactName,
  artifactTypeQName
) {
  const nodeTemplate = {
    documentation: [],
    any: [],
    otherAttributes: {},
    relationshipTemplates: [],
    nodeTemplates: [
      {
        documentation: [],
        any: [],
        otherAttributes: {
          "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}x": 1245,
          "{http://www.opentosca.org/winery/extensions/tosca/2013/02/12}y": 350,
        },
        properties: {
          propertyType: "KV",
          kvproperties: {
            Port: "",
            Name: "",
          },
          elementName: "properties",
          namespace:
            "http://opentosca.org/nodetypes/propertiesdefinition/winery",
        },
        id: nodeTypeQName.split(/}(.*)/s)[1],
        type: nodeTypeQName,
        name: name,
        minInstances: 1,
        maxInstances: 1,
        x: 1245,
        y: 350,
        capabilities: [],
        requirements: [],
        deploymentArtifacts: [
          {
            documentation: [],
            any: [],
            otherAttributes: {},
            name: artifactName,
            artifactType: artifactTypeQName,
            artifactRef: artifactTemplateQName,
          },
        ],
        policies: null,
      },
    ],
  };
  const response = await fetch(
    `${getWineryEndpoint()}/servicetemplates/${serviceTemplateAddress}topologytemplate`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(nodeTemplate),
    }
  );
  return response.status === 204;
}

export async function getServiceTemplateXML(serviceTemplateAddress) {
  const response = await fetch(
    `${getWineryEndpoint()}/servicetemplates/${serviceTemplateAddress}xml`,
    {
      method: "GET",
      headers: {
        Accept: "application/xml",
      },
    }
  );
  return response.json();
}

export async function insertTopNodeTag(serviceTemplateAddress, nodeTypeQName) {
  const tag = {
    name: "top-node",
    value: nodeTypeQName.split(/}(.*)/s)[1],
  };
  const response = await fetch(
    getWineryEndpoint() +
      "/servicetemplates/" +
      serviceTemplateAddress +
      "tags/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(tag),
    }
  );
  return response.text();
}

export async function createServiceTemplateWithNodeAndArtifact(
  name,
  nodeTypeQName,
  nodeName,
  artifactTemplateQName,
  artifactName,
  artifactTypeQName
) {
  const serviceTemplateAddress = await createServiceTemplate(name, "http://quantil.org/quantme/push");
  await addNodeWithArtifactToServiceTemplate(
    serviceTemplateAddress,
    nodeTypeQName,
    nodeName,
    artifactTemplateQName,
    artifactName,
    artifactTypeQName
  );
  return serviceTemplateAddress;
}

export async function getArtifactTemplateInfo(artifactTemplateAddress) {
  const response = await fetch(
    `${getWineryEndpoint()}/artifacttemplates/${artifactTemplateAddress}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );
  return response.json();
}

const nodeTypeQNameMapping = new Map([
  [
    "{http://opentosca.org/artifacttypes}WAR",
    "{http://opentosca.org/nodetypes}TomcatApplication_WAR-w1",
  ],
  [
    "{http://opentosca.org/artifacttypes}WAR-Java17",
    "{http://opentosca.org/nodetypes}TomcatApplication_WAR-w1",
  ],
  [
    "{http://opentosca.org/artifacttypes}WAR-Java8",
    "{http://opentosca.org/nodetypes}TomcatApplication_WAR-w1",
  ],
  [
    "{http://opentosca.org/artifacttypes}PythonArchiveArtifact",
    "{http://opentosca.org/nodetypes}PythonApp_3-w1",
  ],
]);
export function getNodeTypeQName(artifactTypeQName) {
  return nodeTypeQNameMapping.get(artifactTypeQName);
}

export async function loadTopology(deploymentModelUrl) {
  if (deploymentModelUrl.startsWith("{{ wineryEndpoint }}")) {
    deploymentModelUrl = deploymentModelUrl.replace(
      "{{ wineryEndpoint }}",
      config.getWineryEndpoint()
    );
  }
  let topology;
  let tags;
  try {
    topology = await fetch(
      deploymentModelUrl.replace("?csar", "topologytemplate"),
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    ).then((res) => res.json());
    tags = await fetch(deploymentModelUrl.replace("?csar", "tags")).then(
      (res) => res.json()
    );
  } catch (e) {
    throw new Error(
      "An unexpected error occurred during loading the deployments models topology."
    );
  }
  let topNode;
  const topNodeTag = tags.find((tag) => tag.name === "top-node");
  if (topNodeTag) {
    const topNodeId = topNodeTag.value;
    topNode = topology.nodeTemplates.find(
      (nodeTemplate) => nodeTemplate.id === topNodeId
    );
    if (!topNode) {
      throw new Error(`Top level node "${topNodeId}" not found.`);
    }
  } else {
    let nodes = new Map(
      topology.nodeTemplates.map((nodeTemplate) => [
        nodeTemplate.id,
        nodeTemplate,
      ])
    );
    for (let relationship of topology.relationshipTemplates) {
      if (relationship.name === "HostedOn") {
        nodes.delete(relationship.targetElement.ref);
      }
    }
    if (nodes.size === 1) {
      topNode = nodes.values().next().value;
    }
  }
  if (!topNode) {
    throw new Error("No top level node found.");
  }

  return {
    topNode,
    nodeTemplates: topology.nodeTemplates,
    relationshipTemplates: topology.relationshipTemplates,
  };
}

/**
 * Generate a deployment model to deploy the generated hybrid program and the corresponding agent
 *
 * @param programBlobs the blobs containing the data for the hybrid program and agent
 * @param wineryEndpoint endpoint of the Winery instance to create the deployment model
 * @return the URL of the generated deployment model, or an error if the generation failed
 */
export async function createDeploymentModel(
  programBlobs,
  wineryEndpoint,
  localNamePrefix,
  artifactTemplateNamespace,
  artifactType,
  fileName,
  serviceTemplateURL
) {
  // create a new ArtifactTemplate and upload the agent file (the agent currently also contains the program and we deploy them together)
  let artifactName = await createNewArtifactTemplate(
    wineryEndpoint,
    localNamePrefix,
    artifactTemplateNamespace,
    artifactType,
    programBlobs,
    fileName
  );

  // create new ServiceTemplate for the hybrid program by adding a new version of the predefined template
  //let serviceTemplateURL = await createNewServiceTemplateVersion(
  // wineryEndpoint,
  //serviceTemplateName,
  //serviceTemplateNamespace
  //);
  //if (serviceTemplateURL.error !== undefined) {
  // return { error: serviceTemplateURL.error };
  //}

  // update DA reference within the created ServiceTemplate version
  let getTemplateXmlResult = await fetch(serviceTemplateURL + "xml");
  let getTemplateXmlResultJson = await getTemplateXmlResult.text();
  getTemplateXmlResultJson = getTemplateXmlResultJson.replace(
    ':QiskitRuntimeAgentContainer_DA"',
    ":" + artifactName + '"'
  );
  await fetch(serviceTemplateURL, {
    method: "PUT",
    body: getTemplateXmlResultJson,
    headers: { "Content-Type": "application/xml" },
  });

  // replace concrete Winery endpoint with abstract placeholder to enable QAA transfer into another environment
  let deploymentModelUrl = serviceTemplateURL.replace(
    wineryEndpoint,
    "{{ wineryEndpoint }}"
  );
  deploymentModelUrl += "?csar";
  return { deploymentModelUrl: deploymentModelUrl };
}

export async function createNodeType(name, namespace) {
  const nodetype = {
    localname: name,
    namespace: namespace,
  };
  const response = await fetch(`${getWineryEndpoint()}/nodetypes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/plain",
    },
    body: JSON.stringify(nodetype),
  });
  return response.text();
}

export async function updateNodeType(name, namespace) {
  const nodetype = nodeTypeDefinition.replaceAll("NodetypeToReplace", name);
  console.log(
    getWineryEndpoint() +
      "/nodetypes/" +
      encodeURIComponent(encodeURIComponent(namespace)) +
      "/" +
      name
  );
  console.log(nodetype);
  const response = await fetch(
    `${getWineryEndpoint()}/nodetypes/${encodeURIComponent(
      encodeURIComponent(namespace)
    )}/${name}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/xml",
        Accept: "text/plain",
      },
      body: nodetype,
    }
  );
  return response.text();
}

export async function updateServiceTemplate(name, namespace) {
  const topologyTemplate = topologyTemplateDefinition.replaceAll(
    "NodetypeToReplace",
    name
  );
  console.log(
    getWineryEndpoint() +
      "/servicetemplates/" +
      encodeURIComponent(encodeURIComponent(namespace)) +
      "/" +
      name
  );
  console.log(topologyTemplate);
  const response = await fetch(
    `${getWineryEndpoint()}/servicetemplates/${encodeURIComponent(
      encodeURIComponent(namespace)
    )}/${name}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/xml",
        Accept: "text/plain",
      },
      body: topologyTemplate,
    }
  );
  return response.text();
}
