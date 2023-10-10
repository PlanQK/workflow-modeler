import React from "react";
import AdaptationPlugin from "./adaptation/AdaptationPlugin";
import QuantMEController from "./control/QuantMEController";
import ExtensibleButton from "../../../editor/ui/ExtensibleButton";

export default function PatternPluginButton() {
  // trigger initial QRM update
  return (
    <ExtensibleButton
      subButtons={[
        <AdaptationPlugin />,
        <QuantMEController />
      ]}
      title="Pattern"
      styleClass="quantme-logo"
      description="Show buttons of the Pattern plugin"
    />
  );
}
