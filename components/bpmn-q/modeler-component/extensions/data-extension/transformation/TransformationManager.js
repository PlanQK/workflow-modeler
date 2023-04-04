// import {
//   createModelerFromXml,
//   getDefinitionsFromXml,
//   getRootProcess,
//   getSingleFlowElement,
//   isFlowLikeElement,
//   PLANQK_SERVICE_TASK,
//   setInputParameter
// } from '../exec-completion/CompletionUtilities';
import {getDi} from 'bpmn-js/lib/draw/BpmnRenderUtil';
import BpmnModeler from "bpmn-js/lib/Modeler";
// import QuantMERenderer from "../modeler-extensions/modeling/QuantMERenderer";
// import customImporter from "../io/index"

// import quantMEModdleExtension from "../modeler-extensions/modeling/resources/quantum4bpmn.json";
// import dataTransformationExtension from "./datatransformation.json";
// import quantMEModdleExtension from '../modeler-extensions/modeling/resources/quantum4bpmn.json';
// import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json'
// import {
//   BpmnPropertiesPanelModule,
//   BpmnPropertiesProviderModule, CamundaPlatformPropertiesProviderModule,
//   getExtensionElementsList
// } from 'bpmn-js-properties-panel';
// import dataTransformationExtension from "../transformation/datatransformation.json";
// import {loadDiagram, saveModelerAsLocalFile} from "../io/IoUtilities";
// import { is } from 'bpmn-js/lib/util/ModelUtil';
// import ServiceTaskPaletteProvider from "../exec-completion/ServiceTaskPaletteProvider";
// import QuantMEReplaceMenuProvider from "../modeler-extensions/modeling/QuantMEReplaceMenuProvider";
// import QuantMEFactory from "../modeler-extensions/modeling/QuantMEFactory";
// import QuantMEPathMap from "../modeler-extensions/modeling/QuantMEPathMap";
// import CustomContextPadProvider from "../modeler-extensions/modeling/CustomContextPadProvider";
// import BpmnPalletteModule from "bpmn-js/lib/features/palette";
// import quantmePropertiesProvider from "../modeler-extensions/modeling/properties-provider";
// import customRules from "../rules";
let camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda.json');
import CamundaExtensionModule from 'camunda-bpmn-moddle/resources/camunda.json';

/**
 * Replace custome extensions with camunda bpmn elements so that it complies with the standard
 * @param xml the xml model which contains the elements to replace
 * @param saveResultXmlFn the function to save the rsulting, camunda bpmn compliant xml model
 * @returns {Promise<{xml: *, status: string}|{cause: string, status: string}>}
 */
export async function startDataFlowReplacementProcess(xml, saveResultXmlFn) {
  return { status: 'transformed', xml: xml };
}

export function getDataMaps(process, elementRegistry) {

  // retrieve parent object for later replacement
  const processBo = elementRegistry.get(process.id);

  const dataObjectMaps = [];
  const flowElements = process.flowElements;

  for (let i = 0; i < flowElements.length; i++) {
    let flowElement = flowElements[i];
    console.log(flowElement.$type);
    if (flowElement.$type && (flowElement.$type === 'data:DataObjectMapReference' || flowElement.$type === 'data:DataStoreMapReference')) {
      dataObjectMaps.push({ element: flowElement, parent: processBo });
    }

    // recursively retrieve service tasks if subprocess is found
    if (flowElement.$type && flowElement.$type === 'bpmn:SubProcess') {
      Array.prototype.push.apply(dataObjectMaps, getDataMaps(flowElement, elementRegistry));
    }
  }
  return dataObjectMaps;
}




