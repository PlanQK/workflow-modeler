import {
  isTextFieldEntryEdited,
} from "@bpmn-io/properties-panel";
import PatternSelection, { YamlUpload } from "./PatternSelection";
import PatternSelectionModal from "../../ui/pattern-selection/PatternSelectionModal";

/**
 * This file contains all properties of the Pattern task types and the entries they define.
 */

export function QuantumComputationTaskProperties(element) {

  const entries = [{
    id: "pattern",
    element,
    component: YamlUpload,
    isEdited: isTextFieldEntryEdited,
  }];

  // add algorithm and provider attributes
  return entries;
}
