/**
 * Copyright (c) 2023 Institute of Architecture of Application Systems -
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

const QUANTME_NAMESPACE_PUSH = "http://quantil.org/quantme/push";

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

export async function createServiceTemplate(name) {
  const serviceTemplate = {
    localname: name,
    namespace: QUANTME_NAMESPACE_PUSH,
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
  const serviceTemplateAddress = await createServiceTemplate(name);
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
