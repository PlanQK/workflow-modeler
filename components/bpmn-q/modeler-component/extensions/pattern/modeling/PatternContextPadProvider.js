/**
 * Copyright (c) 2023 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import inherits from "inherits";

import ContextPadProvider from "bpmn-js/lib/features/context-pad/ContextPadProvider";

import { bind } from "min-dash";

import * as consts from "../Constants";

export default function PatternContextPadProvider(injector) {
  injector.invoke(ContextPadProvider, this);
  bind(this.getContextPadEntries, this);

  const _getContextPadEntries =
    ContextPadProvider.prototype.getContextPadEntries;
  ContextPadProvider.prototype.getContextPadEntries = function (element) {
    const entries = _getContextPadEntries.apply(this, [element]);
    if (consts.PATTERNS.includes(element.type)) {
      delete entries["append.end-event"];
      delete entries["append.intermediate-event"];
      delete entries["append.gateway"];
      delete entries["append.append-task"];
      delete entries["append.text-annotation"];
      delete entries["connect"];
    }
    return entries;
  };
}

inherits(PatternContextPadProvider, ContextPadProvider);

PatternContextPadProvider.$inject = ["injector", "connect", "translate"];
