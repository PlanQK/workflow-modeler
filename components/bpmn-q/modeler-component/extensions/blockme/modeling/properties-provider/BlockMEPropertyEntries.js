/**
 * Copyright (c) 2024 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "@bpmn-io/properties-panel/preact/compat";

import {
  TextFieldEntry,
  TextAreaEntry,
} from "@bpmn-io/properties-panel";
import * as consts from "../../Constants";
import { useService } from "bpmn-js-properties-panel";

/**
 * All entries needed to display the different properties introduced through the BlockME task types. One entry represents one
 * property.
 */

export function SmartContractEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.sc;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      sc: newValue,
    });
  };

  return (
    <TextFieldEntry
      id={consts.SMART_CONTRACT}
      element={element}
      label={translate("Smart Contract")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}

export function SignatureEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.signature;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      signature: newValue,
    });
  };

  return (
    <TextAreaEntry
      id={consts.SIGNATURE}
      element={element}
      label={translate("Signature")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}

export function OutputsEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.outputs;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      outputs: newValue,
    });
  };

  return (
    <TextAreaEntry
      id={consts.OUTPUTS}
      element={element}
      label={translate("Outputs")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}

export function InputArgsEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.inArgs;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      inArgs: newValue,
    });
  };

  return (
    <TextAreaEntry
      id={consts.INPUT_ARGS}
      label={translate("Input Args")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}

export function OutputArgsEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.outArgs;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      outArgs: newValue,
    });
  };

  return (
    <TextAreaEntry
      id={consts.OUTPUT_ARGS}
      label={translate("Output Args")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}

export function IsStatefulEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.isStateful;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      isStateful: newValue,
    });
  };

  return (
    <TextFieldEntry
      id={consts.IS_STATEFUL}
      label={translate("Is Stateful")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}

export function CorrelationIdEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.corrId;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      corrId: newValue,
    });
  };

  return (
    <TextFieldEntry
      id={consts.CORRELATION_ID}
      label={translate("Correlation ID")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}

export function DegreeOfConfidenceEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.doc;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      doc: newValue,
    });
  };

  return (
    <TextFieldEntry
      id={consts.DEGREE_OF_CONFIDENCE}
      label={translate("Degree of Confidence")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}

export function ToEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.to;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      to: newValue,
    });
  };

  return (
    <TextFieldEntry
      id={consts.TO}
      label={translate("To")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}

export function ValueEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.value;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      value: newValue,
    });
  };

  return (
    <TextFieldEntry
      id={consts.VALUE}
      label={translate("Value")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}

export function TimestampEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.timestamp;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      timestamp: newValue,
    });
  };


  return (
    <TextFieldEntry
      id={consts.TIMESTAMP}
      label={translate("Timestamp")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}

export function FromEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.from;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      from: newValue,
    });
  };

  return (
    <TextFieldEntry
      id={consts.FROM}
      label={translate("From")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}

export function RefEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.ref;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      ref: newValue,
    });
  };

  return (
    <TextFieldEntry
      id={consts.REF}
      label={translate("Reference")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}

