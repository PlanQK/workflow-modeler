import {
  isTextFieldEntryEdited,
  TextAreaEntry,
} from "@bpmn-io/properties-panel";
import PatternSelection, { YamlUpload } from "./PatternSelection";
import PatternSelectionModal from "../../ui/pattern-selection/PatternSelectionModal";
import { useService } from "bpmn-js-properties-panel";

/**
 * This file contains all properties of the Pattern task types and the entries they define.
 */

export function QuantumComputationTaskProperties(element) {

  const entries = [{
    id: "pattern",
    element,
    component: YamlUpload,
    isEdited: isTextFieldEntryEdited,
  },
  {
    id: "behaviorPatterns",
    element,
    component: Applications,
    isEdited: isTextFieldEntryEdited,
  },
];

  // add algorithm and provider attributes
  return entries;
}


function Applications(props) {
 const { element } = props;

 const translate = useService("translate");
 const debounce = useService("debounceInput");

 const getValue = () => {
   return (
     element.businessObject.behaviorPatterns ||
     "Select an application and service"
   );
 };

 return TextAreaEntry({
   element,
   id: "subscribing_app_name",
   label: translate("Application"),
   getValue,
   disabled: true,
   debounce,
   rows: 1,
 });
}