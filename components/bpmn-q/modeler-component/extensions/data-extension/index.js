import './resources/data-flow-styles.css';
import DataFlowRenderer from './rendering/DataFlowRenderer';
import DataFlowReplaceMenuProvider from './menu/DataFlowReplaceMenuProvider';
import DataFlowPaletteProvider from './palette/DataFlowPaletteProvider';
import DataFlowRulesProvider from './rules/DataFlowRulesProvider';

export default {
  __init__: ['dataFlowRenderer', 'dataFlowMenuProvider', 'dataFlowPaletteProvider', 'dataFlowRules'],
  dataFlowRenderer: ['type', DataFlowRenderer],
  dataFlowMenuProvider: ['type', DataFlowReplaceMenuProvider],
  dataFlowPaletteProvider: ['type', DataFlowPaletteProvider],
  dataFlowRules: ['type', DataFlowRulesProvider],
};