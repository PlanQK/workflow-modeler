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
const STROKE_STYLE = {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    stroke: '#777777',
    strokeWidth: 2,
    strokeDasharray: 4,
};

export default class OpenToscaRenderer extends BpmnRenderer {
    constructor(config, eventBus, styles, pathMap, canvas, textRenderer) {
        super(config, eventBus, styles, pathMap, canvas, textRenderer, HIGH_PRIORITY);
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
            element.showDeploymentModel = !element.showDeploymentModel;
            e.preventDefault();
            if (element.showDeploymentModel) {
                this.showDeploymentModel(parentGfx, element, deploymentModelUrl);
            } else {
                this.removeDeploymentModel(parentGfx);
            }
        });
        if (element.showDeploymentModel) {
            this.showDeploymentModel(parentGfx, element, deploymentModelUrl);
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
                this.removeDeploymentModel(parentGfx);
                console.error(e);
                NotificationHandler.getInstance().displayNotification({
                    type: 'warning',
                    title: 'Could not load topology',
                    content: e.message,
                    duration: 2000
                });
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

        for (let relationshipTemplate of relationshipTemplates) {
            const start = positions.get(relationshipTemplate.sourceElement.ref);
            const end = positions.get(relationshipTemplate.targetElement.ref);
            this.drawRelationship(groupDef,
                start, relationshipTemplate.sourceElement.ref === topNode.id,
                end, relationshipTemplate.targetElement.ref === topNode.id);
        }
    }

    removeDeploymentModel(parentGfx) {
        const group = select(parentGfx, '#' + DEPLOYMENT_GROUP_ID)
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
    'textRenderer'
];



