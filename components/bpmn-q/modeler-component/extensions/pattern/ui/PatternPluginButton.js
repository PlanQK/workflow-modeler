import React from "react";
import AdaptationPlugin from "./adaptation/AdaptationPlugin";
import ExtensibleButton from "../../../editor/ui/ExtensibleButton";

export default function PatternPluginButton() {
  // trigger initial QRM update
  return (
    <ExtensibleButton
      subButtons={[
        <AdaptationPlugin />,
      ]}
      title="Pattern"
      styleClass="pattern-logo"
      description="Show buttons of the Pattern plugin"
    />
  );
}
