import inherits from "inherits";

import ContextPadProvider from "bpmn-js/lib/features/context-pad/ContextPadProvider";

import { bind } from "min-dash";

import * as consts from "../Constants";

export default function OpenTOSCAContextPadProvider(injector) {
  injector.invoke(ContextPadProvider, this);
  bind(this.getContextPadEntries, this);

  const _getContextPadEntries =
    ContextPadProvider.prototype.getContextPadEntries;
  ContextPadProvider.prototype.getContextPadEntries = function (element) {
    const entries = _getContextPadEntries.apply(this, [element]);
    if (consts.POLICIES.includes(element.type)) {
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

inherits(OpenTOSCAContextPadProvider, ContextPadProvider);

OpenTOSCAContextPadProvider.$inject = ["injector", "connect", "translate"];
