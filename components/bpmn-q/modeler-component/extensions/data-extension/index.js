import './resources/data-flow-styles.css';
import DataFlowRenderer from './rendering/DataFlowRenderer';
import DataFlowReplaceMenuProvider from './menu/DataFlowReplaceMenuProvider';
import DataFlowPaletteProvider from './palette/DataFlowPaletteProvider';
import DataFlowRulesProvider from './rules/DataFlowRulesProvider';
import DataFlowContextPadProvider from './context-pad/DataFlowContextPadProvider';
import DataReplaceConnectionBehavior from './rules/DataReplaceConnectionBehaviour';
import DataFlowPropertiesProvider from './properties-panel/DataFlowPropertiesProvider';

export default {
  __init__: [
    'dataFlowRenderer',
    'dataFlowMenuProvider',
    'dataFlowPaletteProvider',
    'dataFlowRules',
    'dataFlowContextPadProvider',
    'replaceConnectionBehavior',
    'dataFlowPropertiesProvider'
  ],
  dataFlowRenderer: ['type', DataFlowRenderer],
  dataFlowMenuProvider: ['type', DataFlowReplaceMenuProvider],
  dataFlowPaletteProvider: ['type', DataFlowPaletteProvider],
  dataFlowRules: ['type', DataFlowRulesProvider],
  dataFlowContextPadProvider: ['type', DataFlowContextPadProvider],
  replaceConnectionBehavior: ['type', DataReplaceConnectionBehavior],
  dataFlowPropertiesProvider: ['type', DataFlowPropertiesProvider]
};