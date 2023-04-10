import './resources/qhana-icons.css';
import QHAnaRenderer from './rendering/QHAnaRenderer';
import QHAnaReplaceMenuProvider from './menu/QHAnaReplaceMenuProvider';
export default {
  __init__: [
    'qhanaRenderer',
    'qhanaReplaceMenu',
  ],
  qhanaRenderer: ['type', QHAnaRenderer],
  qhanaReplaceMenu: ['type', QHAnaReplaceMenuProvider],
};