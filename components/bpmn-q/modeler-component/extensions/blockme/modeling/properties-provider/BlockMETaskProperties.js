import * as consts from "../../Constants";
import {
  isTextFieldEntryEdited
} from "@bpmn-io/properties-panel";
import {
  SCLEntry,
  SignatureEntry,
  OutputsEntry,
  InputArgsEntry,
  IsStatefulEntry,
  CorrelationIdEntry,
  DegreeOfConfidenceEntry,
  ValueEntry,
  FromEntry,
  RefEntry, OutputArgsEntry, TimestampEntry
} from "./BlockMEPropertyEntries";

/**
 * This file contains all properties of the BlockME task types and the entries they define.
 */

export function InvokeSCFunctionTaskProperties(element) {
  // add algorithm and provider attributes
  return [
    {
      id: consts.SCL,
      element,
      component: SCLEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.SIGNATURE,
      element,
      component: SignatureEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.OUTPUTS,
      element,
      component: OutputsEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.INPUT_ARGS,
      element,
      component: InputArgsEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.IS_STATEFUL,
      element,
      component: IsStatefulEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.CORRELATION_ID,
      element,
      component: CorrelationIdEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.DEGREE_OF_CONFIDENCE,
      element,
      component: DegreeOfConfidenceEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function SendTxTaskProperties(element) {
  // add quantumCircuit and url attributes
  return [
    {
      id: consts.SCL,
      element,
      component: SCLEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.VALUE,
      element,
      component: ValueEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.CORRELATION_ID,
      element,
      component: CorrelationIdEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.DEGREE_OF_CONFIDENCE,
      element,
      component: DegreeOfConfidenceEntry,
      isEdited: isTextFieldEntryEdited,
    }
  ];
}

export function ReceiveTxTaskProperties(element) {
  // add encodingSchema and programmingLanguage attributes
  return [
    {
      id: consts.SCL,
      element,
      component: SCLEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.FROM,
      element,
      component: FromEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.CORRELATION_ID,
      element,
      component: CorrelationIdEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.DEGREE_OF_CONFIDENCE,
      element,
      component: DegreeOfConfidenceEntry,
      isEdited: isTextFieldEntryEdited,
    }
  ];
}

export function EnsureTxStateTaskProperties(element) {
  // add oracleId, oracleCircuit, oracleFunction and programmingLanguage attributes
  return [
    {
      id: consts.SCL,
      element,
      component: SCLEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.CORRELATION_ID,
      element,
      component: CorrelationIdEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.REF,
      element,
      component: RefEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.DEGREE_OF_CONFIDENCE,
      element,
      component: DegreeOfConfidenceEntry,
      isEdited: isTextFieldEntryEdited,
    }
  ];
}

export function InvokeSCFunctionTaskOutputProperties(element) {
  return [
    {
      id: consts.OUTPUT_ARGS,
      element,
      component: OutputArgsEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.TIMESTAMP,
      element,
      component: TimestampEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function SendTxTaskOutputProperties(element) {
  return [
    {
      id: consts.TIMESTAMP,
      element,
      component: TimestampEntry,
      isEdited: isTextFieldEntryEdited,
    }
  ];
}

export function ReceiveTxTaskOutputProperties(element) {
  return [
    {
      id: consts.FROM,
      element,
      component: FromEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.VALUE,
      element,
      component: ValueEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.TIMESTAMP,
      element,
      component: TimestampEntry,
      isEdited: isTextFieldEntryEdited,
    }
  ];
}