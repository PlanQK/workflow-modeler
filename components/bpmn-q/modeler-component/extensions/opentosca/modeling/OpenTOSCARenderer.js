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

import {connectPoints} from "diagram-js/lib/layout/ManhattanLayout";

import {createLine} from "diagram-js/lib/util/RenderUtil";

import BpmnRenderer from "bpmn-js/lib/draw/BpmnRenderer";
import {getOrientation} from "diagram-js/lib/layout/LayoutUtil";

import buttonIcon from "../resources/show-deployment-button.svg?raw";
import {drawTaskSVG} from "../../../editor/util/RenderUtilities";
import NotificationHandler from "../../../editor/ui/notifications/NotificationHandler";
import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
    select,
    prepend as svgPrepend,
} from "tiny-svg";
import {query as domQuery} from "min-dom";

import {loadTopology} from "../deployment/WineryUtils";

const HIGH_PRIORITY = 14001;
const SERVICE_TASK_TYPE = "bpmn:ServiceTask";
const DEPLOYMENT_GROUP_ID = "deployment";
const DEPLOYMENT_REL_MARKER_ID = "deployment-rel";

const LABEL_WIDTH = 65;
const LABEL_HEIGHT = 15;
const NODE_WIDTH = 100;
const NODE_HEIGHT = 60;
const NODE_SHIFT_MARGIN = 10;
const STROKE_STYLE = {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    stroke: "#777777",
    strokeWidth: 2,
    strokeDasharray: 4,
};

export default class OpenTOSCARenderer extends BpmnRenderer {
    constructor(
        config,
        eventBus,
        styles,
        pathMap,
        canvas,
        textRenderer,
        commandStack,
        elementRegistry
    ) {
        super(
            config,
            eventBus,
            styles,
            pathMap,
            canvas,
            textRenderer,
            HIGH_PRIORITY
        );
        this.commandStack = commandStack;
        this.elementRegistry = elementRegistry;
        this.styles = styles;
        this.textRenderer = textRenderer;
        this.eventBus = eventBus;

        // snap boundary events
        eventBus.on(
            ["create.move", "create.end", "shape.move.move", "shape.move.end"],
            140000,
            function (event) {
                var context = event.context,
                    canExecute = context.canExecute,
                    target = context.target;

                var canAttach =
                    canExecute && (canExecute === "attach" || canExecute.attach);
                const isRelevantEvent =
                    context.shape.type === "bpmn:IntermediateThrowEvent" ||
                    context.shape.type === "bpmn:BoundaryEvent";

                if (
                    canAttach &&
                    isRelevantEvent &&
                    context.target.businessObject.get("opentosca:deploymentModelUrl") &&
                    getOrientation(event, target, -30) === "bottom-right"
                ) {
                    // Prevent snapping on deployment visualisation toggle button
                    event.stopPropagation();
                }
            }
        );

        this.openToscaHandlers = {
            [SERVICE_TASK_TYPE]: function (self, parentGfx, element) {
                const task = self.renderer("bpmn:ServiceTask")(parentGfx, element);
                self.showDeploymentModelButton(parentGfx, element);
                return task;
            },
        };
        this.addMarkerDefinition(canvas);
        this.registerShowDeploymentModelHandler();
        this.currentlyShownDeploymentsModels = new Map();
    }

    registerShowDeploymentModelHandler() {
        this.commandStack.register("deploymentModel.showAll", {
            execute: ({showDeploymentModel}) => {
                const elementsWithDeploymentModel = this.elementRegistry.filter(
                    (element) =>
                        element.businessObject.get("opentosca:deploymentModelUrl")
                );
                const changed = [];
                for (const element of elementsWithDeploymentModel) {
                    const wasShownDeploymentModel = !!element.showDeploymentModel;
                    element.showDeploymentModel = showDeploymentModel;
                    element.wasShownDeploymentModel = wasShownDeploymentModel;
                    if (wasShownDeploymentModel !== showDeploymentModel) {
                        changed.push(element);
                    }
                }
                return changed;
            },

            revert({showDeploymentModel}) {
                return this.execute({showDeploymentModel: !showDeploymentModel});
            },
        });

        this.commandStack.register("deploymentModel.show", {
            execute: ({element, showDeploymentModel}) => {
                const wasShownDeploymentModel = !!element.showDeploymentModel;
                element.showDeploymentModel = showDeploymentModel;
                element.wasShownDeploymentModel = wasShownDeploymentModel;
                if (wasShownDeploymentModel !== showDeploymentModel) {
                    return [element];
                }
                return [];
            },

            revert({element, showDeploymentModel}) {
                return this.execute({
                    element,
                    showDeploymentModel: !showDeploymentModel,
                });
            },
        });
    }

    addMarkerDefinition(canvas) {
        const marker = svgCreate("marker", {
            id: DEPLOYMENT_REL_MARKER_ID,
            viewBox: "0 0 8 8",
            refX: 8,
            refY: 4,
            markerWidth: 8,
            markerHeight: 8,
            orient: "auto",
        });
        svgAppend(
            marker,
            svgCreate("path", {
                d: "M 0 0 L 8 4 L 0 8",
                ...this.styles.computeStyle({}, ["no-fill"], {
                    ...STROKE_STYLE,
                    strokeWidth: 1,
                    strokeDasharray: 2,
                }),
            })
        );

        let defs = domQuery("defs", canvas._svg);
        if (!defs) {
            defs = svgCreate("defs");

            svgPrepend(canvas._svg, defs);
        }
        svgAppend(defs, marker);
    }

    showDeploymentModelButton(parentGfx, element) {
        let deploymentModelUrl = element.businessObject.get(
            "opentosca:deploymentModelUrl"
        );
        if (!deploymentModelUrl) return;

        const button = drawTaskSVG(
            parentGfx,
            {
                transform: "matrix(0.3, 0, 0, 0.3, 85, 65)",
                svg: buttonIcon,
            },
            null,
            true
        );
        button.style["pointer-events"] = "all";
        button.style["cursor"] = "pointer";
        button.addEventListener("click", (e) => {
            e.preventDefault();
            element.deploymentModelTopology = undefined;
            this.commandStack.execute("deploymentModel.show", {
                element: element,
                showDeploymentModel: !element.showDeploymentModel,
            });
        });
        if (element.showDeploymentModel) {
            this.showDeploymentModel(parentGfx, element, deploymentModelUrl);
        } else {
            this.removeDeploymentModel(parentGfx, element);
        }
    }

    async showDeploymentModel(parentGfx, element, deploymentModelUrl) {
        if (
            !element.deploymentModelTopology ||
            element.loadedDeploymentModelUrl !== deploymentModelUrl
        ) {
            try {
                const topology = await loadTopology(deploymentModelUrl);
                element.loadedDeploymentModelUrl = deploymentModelUrl;
                element.deploymentModelTopology = topology;
            } catch (e) {
                element.showDeploymentModel = false;
                element.loadedDeploymentModelUrl = null;
                element.deploymentModelTopology = null;
                this.removeDeploymentModel(parentGfx, element);
                console.error(e);
                NotificationHandler.getInstance().displayNotification({
                    type: "warning",
                    title: "Could not load topology",
                    content: e.message,
                    duration: 2000,
                });
                return;
            }
        }
        const groupDef = svgCreate("g", {id: DEPLOYMENT_GROUP_ID});
        parentGfx.append(groupDef);

        const {nodeTemplates, relationshipTemplates, topNode} =
            element.deploymentModelTopology;

        let ySubtract = parseInt(topNode.y);
        let xSubtract = parseInt(topNode.x);

        const positions = new Map();
        for (let nodeTemplate of nodeTemplates) {
            const position = {
                x: (parseInt(nodeTemplate.x) - xSubtract) / 1.4,
                y: (parseInt(nodeTemplate.y) - ySubtract) / 1.4,
            };

            positions.set(nodeTemplate.id, position);
            if (nodeTemplate.id !== topNode.id) {
                this.drawNodeTemplate(groupDef, nodeTemplate, position);
            }
        }
        const boundingBox = {
            left: Math.min(...[...positions.values()].map((p) => p.x)) + element.x,
            top: Math.min(...[...positions.values()].map((p) => p.y)) + element.y,
            right:
                Math.max(...[...positions.values()].map((p) => p.x)) +
                NODE_WIDTH +
                element.x,
            bottom:
                Math.max(...[...positions.values()].map((p) => p.y)) +
                NODE_HEIGHT +
                element.y,
        };

        this.expandSurroundingSubProcess(element, boundingBox);
        const previousBoundingBox = this.currentlyShownDeploymentsModels.get(
            element.id
        )?.boundingBox;
        if (JSON.stringify(previousBoundingBox) !== JSON.stringify(boundingBox)) {
            this.moveNeighborNodes(boundingBox, element);
        }

        this.currentlyShownDeploymentsModels.set(element.id, {
            boundingBox,
        });

        this.drawNodeConnections(
            parentGfx,
            topNode,
            relationshipTemplates,
            positions
        );
    }

    drawNodeConnections(
        parentGfx,
        topNode,
        relationshipTemplates,
        nodePositions
    ) {
        const connectionsAtNodeLocations = new Map();
        const connections = [];

        const addToPort = (node, location, otherNode) => {
            const key = node.ref + "-" + location;
            let nodesAtPort = connectionsAtNodeLocations.get(key);
            if (!nodesAtPort) {
                nodesAtPort = [];
                connectionsAtNodeLocations.set(key, nodesAtPort);
            }
            nodesAtPort.push(otherNode);
        };

        const addConnection = (
            source,
            sourceLocation,
            target,
            targetLocation,
            connectionName
        ) => {
            addToPort(source, sourceLocation, target);
            addToPort(target, targetLocation, source);
            connections.push({
                source,
                target,
                sourceLocation,
                targetLocation,
                connectionName,
            });
        };

        for (let relationshipTemplate of relationshipTemplates) {
            const sourceRef = relationshipTemplate.sourceElement.ref;
            const targetRef = relationshipTemplate.targetElement.ref;
            const source = {
                width: NODE_WIDTH,
                height: sourceRef === topNode.id ? 80 : NODE_HEIGHT,
                ref: sourceRef,
                ...nodePositions.get(sourceRef),
            };
            const target = {
                width: NODE_WIDTH,
                height: sourceRef === topNode.id ? 80 : NODE_HEIGHT,
                ref: targetRef,
                ...nodePositions.get(targetRef),
            };
            const orientation = getOrientation(source, target, 0);

            switch (orientation) {
                case "intersect":
                case "bottom":
                    addConnection(
                        source,
                        "north",
                        target,
                        "south",
                        relationshipTemplate.name
                    );
                    break;
                case "top":
                    addConnection(
                        source,
                        "south",
                        target,
                        "north",
                        relationshipTemplate.name
                    );
                    break;
                case "right":
                    addConnection(
                        source,
                        "east",
                        target,
                        "west",
                        relationshipTemplate.name
                    );
                    break;
                case "left":
                    addConnection(
                        source,
                        "west",
                        target,
                        "east",
                        relationshipTemplate.name
                    );
                    break;
                case "top-left":
                    addConnection(
                        source,
                        "south",
                        target,
                        "east",
                        relationshipTemplate.name
                    );
                    break;
                case "top-right":
                    addConnection(
                        source,
                        "south",
                        target,
                        "west",
                        relationshipTemplate.name
                    );
                    break;
                case "bottom-left":
                    addConnection(
                        source,
                        "north",
                        target,
                        "east",
                        relationshipTemplate.name
                    );
                    break;
                case "bottom-right":
                    addConnection(
                        source,
                        "north",
                        target,
                        "west",
                        relationshipTemplate.name
                    );
                    break;
                default:
                    return;
            }
        }

        for (const connection of connections) {
            const getPortPoint = (element, location, otherNode) => {
                const connectionsAtNodeLocation = connectionsAtNodeLocations.get(
                    element.ref + "-" + location
                );
                const locationIndex = connectionsAtNodeLocation.indexOf(otherNode) + 1;
                const portCount = connectionsAtNodeLocation.length;
                if (location === "north") {
                    return {
                        x: element.x + (element.width / (portCount + 1)) * locationIndex,
                        y: element.y,
                    };
                } else if (location === "south") {
                    return {
                        x: element.x + (element.width / (portCount + 1)) * locationIndex,
                        y: element.y + element.height,
                    };
                } else if (location === "east") {
                    return {
                        x: element.x,
                        y: element.y + (element.height / (portCount + 1)) * locationIndex,
                    };
                } else if (location === "west") {
                    return {
                        x: element.x + element.width,
                        y: element.y + (element.height / (portCount + 1)) * locationIndex,
                    };
                }
            };

            const getSimpleDirection = (direction) =>
                direction === "north" || direction === "south" ? "v" : "h";

            connectionsAtNodeLocations.forEach((value, key) => {
                if (value.length > 1) {
                    if (key.includes("north") || key.includes("south")) {
                        value.sort((a, b) => {
                            return a.x - b.x;
                        });
                    } else if (key.includes("east") || key.includes("west")) {
                        value.sort((a, b) => {
                            return a.y - b.y;
                        });
                    }
                }
            });

            const points = connectPoints(
                getPortPoint(
                    connection.source,
                    connection.sourceLocation,
                    connection.target
                ),
                getPortPoint(
                    connection.target,
                    connection.targetLocation,
                    connection.source
                ),
                getSimpleDirection(connection.sourceLocation) +
                ":" +
                getSimpleDirection(connection.targetLocation)
            );

            const line = createLine(
                points,
                this.styles.computeStyle({}, ["no-fill"], {
                    ...STROKE_STYLE,
                    markerEnd: `url(#${DEPLOYMENT_REL_MARKER_ID})`,
                }),
                5
            );

            const labelGroup = svgCreate("g");

            const pathLength = line.getTotalLength();
            const middlePoint = line.getPointAtLength(pathLength / 2);
            svgAttr(labelGroup, {
                transform: `matrix(1, 0, 0, 1, ${(
                    middlePoint.x -
                    LABEL_WIDTH / 2
                ).toFixed(2)}, ${(middlePoint.y - LABEL_HEIGHT / 2).toFixed(2)})`,
            });
            const backgroundRect = svgCreate("rect", {
                width: LABEL_WIDTH,
                height: LABEL_HEIGHT,
                fill: "#EEEEEE",
                fillOpacity: 0.75,
            });
            svgAppend(labelGroup, backgroundRect);
            const text = this.textRenderer.createText(connection.connectionName, {
                box: {
                    width: LABEL_WIDTH,
                    height: LABEL_HEIGHT,
                },
                align: "center-middle",
                style: {
                    fontSize: 10,
                },
            });
            svgAppend(labelGroup, text);
            parentGfx.prepend(labelGroup);
            parentGfx.prepend(line);
        }
    }

    moveNeighborNodes(newBoundingBox, element) {
        let shifts = {
            right: 0,
            left: 0,
        };
        for (const [
            otherElementId,
            otherDeploymentModel,
        ] of this.currentlyShownDeploymentsModels.entries()) {
            if (otherElementId === element.id) continue;
            const otherBoundingBox = otherDeploymentModel.boundingBox;
            if (
                newBoundingBox.left < otherBoundingBox.right &&
                newBoundingBox.right > otherBoundingBox.left &&
                newBoundingBox.top < otherBoundingBox.bottom &&
                newBoundingBox.bottom > otherBoundingBox.top
            ) {
                const distRightShift =
                    newBoundingBox.right - otherBoundingBox.left - shifts.right;
                const distLeftShift =
                    otherBoundingBox.right - newBoundingBox.left - shifts.left;

                if (distRightShift < distLeftShift && distRightShift > 0) {
                    shifts.right += distRightShift;
                } else if (distLeftShift < distRightShift && distLeftShift > 0) {
                    shifts.left += distLeftShift;
                }
            }
        }

        const allElements = this.elementRegistry.getAll();
        const commands = [];

        if (shifts.right || shifts.left) {
            const xPosition = (newBoundingBox.left + newBoundingBox.right) / 2;
            for (const otherElement of allElements) {
                let otherXPosition = element.x + NODE_WIDTH / 2;
                const otherElementBoundingBox =
                    this.currentlyShownDeploymentsModels.get(
                        otherElement.id
                    )?.boundingBox;
                if (otherElementBoundingBox) {
                    otherXPosition =
                        (otherElementBoundingBox.left + otherElementBoundingBox.right) / 2;
                }
                let xShift;
                if (
                    shifts.right &&
                    otherXPosition >= xPosition &&
                    otherElement.id !== element.id
                ) {
                    xShift = shifts.right + NODE_SHIFT_MARGIN;
                } else if (
                    shifts.left &&
                    otherXPosition <= xPosition &&
                    otherElement.id !== element.id
                ) {
                    xShift = -shifts.left - NODE_SHIFT_MARGIN;
                } else {
                    continue;
                }
                // Can not move elements without parent
                if (!otherElement.parent) continue;
                commands.push({
                    cmd: "shape.move",
                    context: {
                        shape: otherElement,
                        hints: {},
                        delta: {x: xShift, y: 0},
                    },
                });
                if (otherElementBoundingBox) {
                    otherElementBoundingBox.left += xShift;
                    otherElementBoundingBox.right += xShift;
                }
            }
        }

        if (commands.length > 0) {
            this.commandStack.execute(
                "properties-panel.multi-command-executor",
                commands
            );
        }
    }

    removeDeploymentModel(parentGfx, element) {
        this.currentlyShownDeploymentsModels.delete(element.id);
        this.collapseSurroundingSubProcess(element);
        const group = select(parentGfx, "#" + DEPLOYMENT_GROUP_ID);
        if (group) {
            group.remove();
        }
    }

    drawNodeTemplate(parentGfx, nodeTemplate, position) {
        const groupDef = svgCreate("g");
        svgAttr(groupDef, {
            transform: `matrix(1, 0, 0, 1, ${position.x.toFixed(
                2
            )}, ${position.y.toFixed(2)})`,
        });
        const rect = svgCreate("rect", {
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
            fill: "#DDDDDD",
            ...STROKE_STYLE,
        });

        svgAppend(groupDef, rect);

        const text = this.textRenderer.createText(nodeTemplate.name, {
            box: {
                width: NODE_WIDTH,
                height: NODE_HEIGHT / 2,
            },
            align: "center-middle",
        });

        svgAppend(groupDef, text);

        const groupDef2 = svgCreate("g");
        svgAttr(groupDef2, {
            transform: `matrix(1, 0, 0, 1, ${position.x.toFixed(2)}, ${(
                position.y +
                NODE_HEIGHT / 2
            ).toFixed(2)})`,
        });

        const namePattern = /\}(.*)/g;
        const typeMatches = namePattern.exec(nodeTemplate.type);
        let typeName;
        if (typeMatches === null || typeMatches.length === 0) {
            typeName = nodeTemplate.type;
        } else {
            typeName = typeMatches[1];
        }

        const typeText = this.textRenderer.createText("(" + typeName + ")", {
            box: {
                width: NODE_WIDTH,
                height: NODE_HEIGHT / 2,
            },
            align: "center-middle",
            style: {
                fill: "#777777",
            },
        });

        svgAppend(groupDef2, typeText);
        parentGfx.append(groupDef);
        parentGfx.append(groupDef2);
    }

    renderer(type) {
        return this.handlers[type];
    }

    canRender(element) {
        // only return true if handler for rendering is registered
        return this.openToscaHandlers[element.type];
    }

    drawShape(parentNode, element) {
        if (element.type in this.openToscaHandlers) {
            const h = this.openToscaHandlers[element.type];
            return h(this, parentNode, element);
        }
        return super.drawShape(parentNode, element);
    }

    collapseSurroundingSubProcess(element) {
        const {surroundingSubProcess} = element;
        if (surroundingSubProcess) {
            element.surroundingSubProcess = undefined;
            const parent = element.parent;
            if (parent === surroundingSubProcess.element) {
                const currentBounds = {
                    x: parent.x,
                    y: parent.y,
                    width: parent.width,
                    height: parent.height,
                };

                let newBounds = surroundingSubProcess.newBounds;
                let oldBounds = surroundingSubProcess.oldBounds;

                let needsResize = false;

                console.log(newBounds, currentBounds, oldBounds);

                if (newBounds.x === currentBounds.x && newBounds.x !== oldBounds.x) {
                    currentBounds.x = oldBounds.x;
                    needsResize = true;
                }
                if (newBounds.y === currentBounds.y && newBounds.y !== oldBounds.y) {
                    currentBounds.y = oldBounds.y;
                    needsResize = true;
                }
                if (newBounds.width === currentBounds.width && newBounds.width !== oldBounds.width) {
                    currentBounds.width = oldBounds.width;
                    needsResize = true;
                }
                if (newBounds.height === currentBounds.height && newBounds.height !== oldBounds.height) {
                    currentBounds.height = oldBounds.height;
                    needsResize = true;
                }

                if (needsResize) {
                    const event = {
                        context: {
                            shape: parent,
                            newBounds: currentBounds,
                            hints: {},
                        },
                    };
                    this.commandStack.execute("shape.resize", event.context);
                }
            }
        }
    }

    expandSurroundingSubProcess(element, boundingBox) {
        if (!element.surroundingSubProcess) {
            const parent = element.parent;
            if (parent && parent.type === "bpmn:SubProcess" && !parent.isExpanded) {
                const oldBounds = {
                    x: parent.x,
                    y: parent.y,
                    width: parent.width,
                    height: parent.height,
                };
                const newBounds = {
                    ...oldBounds,
                };
                let needsResize = false;

                if (oldBounds.x > boundingBox.left) {
                    newBounds.x = boundingBox.left - NODE_WIDTH / 3;
                    needsResize = true;
                }
                if (oldBounds.y > boundingBox.top) {
                    newBounds.y = boundingBox.top - NODE_HEIGHT / 3;
                    needsResize = true;
                }
                if (oldBounds.x + oldBounds.width < boundingBox.right) {
                    newBounds.width = boundingBox.right - oldBounds.x + NODE_WIDTH;
                    needsResize = true;
                }
                if (oldBounds.y + oldBounds.height < boundingBox.bottom) {
                    newBounds.height = boundingBox.bottom - oldBounds.y + NODE_HEIGHT;
                    needsResize = true;
                }

                element.surroundingSubProcess = {
                    element: parent,
                    oldBounds,
                    newBounds,
                };
                if (needsResize) {
                    const event = {
                        context: {
                            shape: parent,
                            newBounds,
                            hints: {},
                        },
                    };
                    this.commandStack.execute("shape.resize", event.context);
                }
            }
        } else {
            if (!element.executingResize) {
                element.executingResize = true;
                const event = {
                    context: {
                        shape: {
                            ...element,
                            parent: element.parent,
                            x: boundingBox.left + NODE_WIDTH / 2,
                            y: boundingBox.top + NODE_HEIGHT / 2,
                            width: boundingBox.right - boundingBox.left - NODE_WIDTH,
                            height: boundingBox.bottom - boundingBox.top - NODE_HEIGHT,
                        },
                        hints: {},
                    },
                };
                this.eventBus.fire("commandStack.shape.resize.preExecute", event);
                this.eventBus.fire("commandStack.shape.resize.postExecuted", event);
                element.executingResize = undefined;
            }
        }
    }
}

OpenTOSCARenderer.$inject = [
    "config",
    "eventBus",
    "styles",
    "pathMap",
    "canvas",
    "textRenderer",
    "commandStack",
    "elementRegistry",
];
