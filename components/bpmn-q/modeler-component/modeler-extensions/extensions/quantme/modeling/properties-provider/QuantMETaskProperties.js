//
import * as consts from "../../Constants";
import {isTextFieldEntryEdited, isSelectEntryEdited} from "@bpmn-io/properties-panel";
import {AlgorithmEntry} from "./QuantMEPropertyEntries.js";
import {
    CalibrationMethodEntry,
    DNNHiddenLayersEntry,
    EncodingSchemaEntry, MaxAgeEntry, MaxCMSizeEntry, MaxREMCostsEntry,
    MitigationMethodEntry,
    NeighborhoodRangeEntry, ObjectiveFunctionEntry, OptimizerEntry,
    OracleCircuitEntry,
    OracleIdEntry,
    OracleURLEntry,
    ProgrammingLanguageEntry,
    ProviderEntry,
    ProvidersEntry,
    QpuEntry,
    QuantumCircuitEntry, SelectionStrategyEntry,
    ShotsEntry, SimulatorsAllowedEntry,
    UrlEntry
} from "./QuantMEPropertyEntries";
import {ORACLE_ID} from "../../Constants";

export function QuantumComputationTaskProperties(element) {

    // add algorithm and provider attributes
    return [
        {
            id: consts.ALGORITHM,
            element,
            component: AlgorithmEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.PROVIDER,
            element,
            component: ProviderEntry,
            isEdited: isTextFieldEntryEdited
        }
    ];
}

export function QuantumCircuitLoadingTaskProperties(element) {

    // add quantumCircuit and url attributes
    return [
        {
            id: consts.QUANTUM_CIRCUIT,
            element,
            component: QuantumCircuitEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.URL,
            element,
            component: UrlEntry,
            isEdited: isTextFieldEntryEdited
        }
    ];
}

export function DataPreparationTaskProperties(element) {

    // add encodingSchema and programmingLanguage attributes
    return [
        {
            id: consts.ENCODING_SCHEMA,
            element,
            component: EncodingSchemaEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.PROGRAMMING_LANGUAGE,
            element,
            component: ProgrammingLanguageEntry,
            isEdited: isTextFieldEntryEdited
        }
    ];
}

export function OracleExpansionTaskProperties(element) {

    // add oracleId, oracleCircuit, oracleFunction and programmingLanguage attributes
    return [
        {
            id: consts.ORACLE_ID,
            element,
            component: OracleIdEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.ORACLE_CIRCUIT,
            element,
            component: OracleCircuitEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.ORACLE_URL,
            element,
            component: OracleURLEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.PROGRAMMING_LANGUAGE,
            element,
            component: ProgrammingLanguageEntry,
            isEdited: isTextFieldEntryEdited
        }
    ];
}

export function QuantumCircuitExecutionTaskProperties(element) {

    // add provider, qpu, shots and programmingLanguage attributes
    return [
        {
            id: consts.PROVIDER,
            element,
            component: ProviderEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.QPU,
            element,
            component: QpuEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.SHOTS,
            element,
            component: ShotsEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.PROGRAMMING_LANGUAGE,
            element,
            component: ProgrammingLanguageEntry,
            isEdited: isTextFieldEntryEdited
        }
    ];
}

export function ReadoutErrorMitigationTaskProperties(element) {

    // add provider, qpu, mitigation method, calibration method, shots, method-specific and restriction attributes
    return [
        {
            id: consts.PROVIDER,
            element,
            component: ProviderEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.QPU,
            element,
            component: QpuEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.MITIGATION_METHOD,
            element,
            component: MitigationMethodEntry,
            isEdited: isSelectEntryEdited
        },
        {
            id: consts.CALIBRATION_METHOD,
            element,
            component: CalibrationMethodEntry,
            isEdited: isSelectEntryEdited
        },
        {
            id: consts.SHOTS,
            element,
            component: ShotsEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.DNN_HIDDEN_LAYER,
            element,
            component: DNNHiddenLayersEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.NEIGHBORHOOD_RANGE,
            element,
            component: NeighborhoodRangeEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.OBJECTIVE_FUNCTION,
            element,
            component: ObjectiveFunctionEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.OPTIMIZER,
            element,
            component: OptimizerEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.MAX_AGE,
            element,
            component: MaxAgeEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.MAX_CM_SIZE,
            element,
            component: MaxCMSizeEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.MAX_REM_COSTS,
            element,
            component: MaxREMCostsEntry,
            isEdited: isTextFieldEntryEdited
        }
    ];
}

export function HardwareSelectionSubprocessProperties(element) {

    // add providers, simulatorsAllowed, and selectionStrategy attributes
    return [
        {
            id: consts.PROVIDERS,
            element,
            component: ProvidersEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.SIMULATORS_ALLOWED,
            element,
            component: SimulatorsAllowedEntry,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: consts.SELECTION_STRATEGY,
            element,
            component: SelectionStrategyEntry,
            isEdited: isTextFieldEntryEdited
        }
    ];
}