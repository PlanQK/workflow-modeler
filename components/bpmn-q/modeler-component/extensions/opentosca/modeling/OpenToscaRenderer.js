import {
    connectRectangles
} from 'diagram-js/lib/layout/ManhattanLayout';

import {
    createLine,
} from 'diagram-js/lib/util/RenderUtil';

import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';

import buttonIcon from '../resources/show-deployment-button.svg?raw';
import {drawTaskSVG} from '../../../editor/util/RenderUtilities';
import * as config from '../framework-config/config-manager';
import NotificationHandler from '../../../editor/ui/notifications/NotificationHandler';
import {append as svgAppend, attr as svgAttr, create as svgCreate, select, prepend as svgPrepend} from 'tiny-svg';
import {query as domQuery} from 'min-dom';
import {loadTopology} from "../deployment/OpenTOSCAUtils";

const HIGH_PRIORITY = 14001;
const SERVICE_TASK_TYPE = 'bpmn:ServiceTask';
const DEPLOYMENT_GROUP_ID = 'deployment';
const DEPLOYMENT_REL_MARKER_ID = 'deployment-rel';

const NODE_WIDTH = 100;
const NODE_HEIGHT = 60;
const NODE_SHIFT_MARGIN = 5;
const STROKE_STYLE = {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    stroke: '#777777',
    strokeWidth: 2,
    strokeDasharray: 4,
};

export default class OpenToscaRenderer extends BpmnRenderer {
    constructor(config, eventBus, styles, pathMap, canvas, textRenderer, commandStack, elementRegistry) {
        super(config, eventBus, styles, pathMap, canvas, textRenderer, HIGH_PRIORITY);
        this.commandStack = commandStack;
        this.elementRegistry = elementRegistry;
        this.styles = styles;
        this.textRenderer = textRenderer;

        this.openToscaHandlers = {
            [SERVICE_TASK_TYPE]: function (self, parentGfx, element) {
                const task = self.renderer('bpmn:ServiceTask')(parentGfx, element);
                self.maybeAddShowDeploymentModelButton(parentGfx, element);
                return task;
            }
        };
        this.addMarkerDefinition(canvas);
        this.registerShowDeploymentModelHandler();
        this.currentlyShownDeploymentsModels = new Map();
    }

    registerShowDeploymentModelHandler() {
        this.commandStack.register("deploymentModel.showAll", {
            execute: ({showDeploymentModel}) => {
                const elementsWithDeploymentModel = this.elementRegistry
                    .filter(element => element.businessObject.get('opentosca:deploymentModelUrl'));
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
            }
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
                return this.execute({element, showDeploymentModel: !showDeploymentModel});
            }
        });
    }

    addMarkerDefinition(canvas) {
        const marker = svgCreate('marker', {
            id: DEPLOYMENT_REL_MARKER_ID,
            viewBox: '0 0 8 8',
            refX: 8,
            refY: 4,
            markerWidth: 8,
            markerHeight: 8,
            orient: 'auto'
        });
        svgAppend(marker, svgCreate('path', {
            d: 'M 0 0 L 8 4 L 0 8',
            ...this.styles.computeStyle({}, ['no-fill'], {
                ...STROKE_STYLE,
                strokeWidth: 1,
                strokeDasharray: 2
            })
        }));

        let defs = domQuery('defs', canvas._svg);
        if (!defs) {
            defs = svgCreate('defs');

            svgPrepend(canvas._svg, defs);
        }
        svgAppend(defs, marker);
    }

    maybeAddShowDeploymentModelButton(parentGfx, element) {
        let deploymentModelUrl = element.businessObject.get('opentosca:deploymentModelUrl');
        if (!deploymentModelUrl) return;

        const button = drawTaskSVG(parentGfx, {
            transform: 'matrix(0.3, 0, 0, 0.3, 85, 65)',
            svg: buttonIcon
        }, null, true);
        button.style['pointer-events'] = 'all';
        button.style['cursor'] = 'pointer';
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.commandStack.execute("deploymentModel.show", {
                element: element,
                showDeploymentModel: !element.showDeploymentModel
            });
        });
        if (element.showDeploymentModel) {
            this.showDeploymentModel(parentGfx, element, deploymentModelUrl);
        } else {
            this.removeDeploymentModel(parentGfx, element);
        }
    }

    async showDeploymentModel(parentGfx, element, deploymentModelUrl) {
        if (!element.deploymentModelTopology || element.loadedDeploymentModelUrl !== deploymentModelUrl) {
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
                    type: 'warning',
                    title: 'Could not load topology',
                    content: e.message,
                    duration: 2000
                });
                return;
            }
        }
        const groupDef = svgCreate('g', {id: DEPLOYMENT_GROUP_ID});
        parentGfx.append(groupDef);

        const {nodeTemplates, relationshipTemplates, topNode} = element.deploymentModelTopology;

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
            left: Math.min(...[...positions.values()].map(p => p.x)) + element.x,
            top: Math.min(...[...positions.values()].map(p => p.y)) + element.y,
            right: Math.max(...[...positions.values()].map(p => p.x)) + NODE_WIDTH + element.x,
            bottom: Math.max(...[...positions.values()].map(p => p.y)) + NODE_HEIGHT + element.y
        };

        const previousBoundingBox = this.currentlyShownDeploymentsModels.get(element.id)?.boundingBox;
        if (JSON.stringify(previousBoundingBox) !== JSON.stringify(boundingBox)) {
            this.mayBeMoveNeighborNodes(boundingBox, element);
        }

        this.currentlyShownDeploymentsModels.set(element.id, {
            boundingBox
        });

        for (let relationshipTemplate of relationshipTemplates) {
            const start = positions.get(relationshipTemplate.sourceElement.ref);
            const end = positions.get(relationshipTemplate.targetElement.ref);
            this.drawRelationship(groupDef,
                start, relationshipTemplate.sourceElement.ref === topNode.id,
                end, relationshipTemplate.targetElement.ref === topNode.id);
        }
    }

    mayBeMoveNeighborNodes(newBoundingBox, element) {
        let shifts = {
            right: 0,
            left: 0,
        };
        for (const [otherElementId, otherDeploymentModel] of this.currentlyShownDeploymentsModels.entries()) {
            if (otherElementId === element.id) continue;
            const otherBoundingBox = otherDeploymentModel.boundingBox;
            if (newBoundingBox.left < otherBoundingBox.right && newBoundingBox.right > otherBoundingBox.left &&
                newBoundingBox.top < otherBoundingBox.bottom && newBoundingBox.bottom > otherBoundingBox.top) {
                const distRightShift = newBoundingBox.right - otherBoundingBox.left - shifts.right;
                const distLeftShift = otherBoundingBox.right - newBoundingBox.left - shifts.left;

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
            const xPosition = (newBoundingBox.left + newBoundingBox.right) / 2
            for (const otherElement of allElements) {
                let otherXPosition = element.x + NODE_WIDTH / 2;
                const otherElementBoundingBox = this.currentlyShownDeploymentsModels.get(otherElement.id)?.boundingBox;
                if (otherElementBoundingBox) {
                    otherXPosition = (otherElementBoundingBox.left + otherElementBoundingBox.right) / 2;
                }
                let xShift
                if (shifts.right && otherXPosition >= xPosition && otherElement.id !== element.id) {
                    xShift = shifts.right + NODE_SHIFT_MARGIN
                } else if (shifts.left && otherXPosition <= xPosition && otherElement.id !== element.id) {
                    xShift = -shifts.left - NODE_SHIFT_MARGIN
                } else {
                    continue
                }
                // Can not move elements without parent
                if(!otherElement.parent) continue;
                commands.push({
                    cmd: 'shape.move',
                    context: {
                        shape: otherElement,
                        hints: {},
                        delta: {x: xShift, y: 0}
                    }
                });
                if (otherElementBoundingBox) {
                    otherElementBoundingBox.left += xShift;
                    otherElementBoundingBox.right += xShift;
                }
            }
        }

        if (commands.length > 0) {
            this.commandStack.execute('properties-panel.multi-command-executor', commands);
        }
    }

    removeDeploymentModel(parentGfx, element) {
        this.currentlyShownDeploymentsModels.delete(element.id);
        const group = select(parentGfx, '#' + DEPLOYMENT_GROUP_ID);
        if (group) {
            group.remove();
        }
    }

    drawRelationship(parentGfx, start, startIsToplevel, end, endIsToplevel) {
        const line = createLine(connectRectangles({
            width: NODE_WIDTH,
            height: startIsToplevel ? 80 : NODE_HEIGHT,
            ...start
        }, {
            width: NODE_WIDTH,
            height: endIsToplevel ? 80 : NODE_HEIGHT,
            ...end
        }), this.styles.computeStyle({}, ['no-fill'], {
            ...STROKE_STYLE,
            markerEnd: `url(#${DEPLOYMENT_REL_MARKER_ID})`
        }), 5);
        parentGfx.prepend(line);
    }

    drawNodeTemplate(parentGfx, nodeTemplate, position) {
        const groupDef = svgCreate('g');
        svgAttr(groupDef, {transform: `matrix(1, 0, 0, 1, ${position.x.toFixed(2)}, ${position.y.toFixed(2)})`});
        const rect = svgCreate('rect', {
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
            fill: '#DDDDDD',
            ...STROKE_STYLE
        });

        svgAppend(groupDef, rect);

        const text = this.textRenderer.createText(nodeTemplate.name, {
            box: {
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
            },
            align: 'center-middle'
        });
        svgAppend(groupDef, text);
        parentGfx.append(groupDef);
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
}

OpenToscaRenderer.$inject = [
    'config',
    'eventBus',
    'styles',
    'pathMap',
    'canvas',
    'textRenderer',
    'commandStack',
    'elementRegistry'
];



