import './resources/data-flow-styles.css';
import DataFlowRenderer from './rendering/DataFlowRenderer';
import DataFlowReplaceMenuProvider from "./menu/DataFlowReplaceMenuProvider";

export default {
    __init__: ['dataFlowRenderer', 'dataFlowMenuProvider'],
    dataFlowRenderer: ['type', DataFlowRenderer],
    dataFlowMenuProvider: ['type', DataFlowReplaceMenuProvider],
};