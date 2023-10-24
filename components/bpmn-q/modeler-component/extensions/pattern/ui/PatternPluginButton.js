import React from "react";
import PatternSelectionPlugin from "./pattern-selection/PatternSelectionPlugin";
import ExtensibleButton from "../../../editor/ui/ExtensibleButton";

export default function PatternPluginButton() {
  // trigger initial QRM update
  return (
    <ExtensibleButton
      subButtons={[<PatternSelectionPlugin />]}
      title="Pattern"
      styleClass="pattern-logo"
      description="Show buttons of the Pattern plugin"
    />
  );
}
