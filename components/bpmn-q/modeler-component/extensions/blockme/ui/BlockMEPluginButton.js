import React from "react";
import QuantMEController from "./control/BlockMEController";
import ExtensibleButton from "../../../editor/ui/ExtensibleButton";
import NotificationHandler from "../../../editor/ui/notifications/NotificationHandler";
import { updateQRMs } from "../qrm-manager";

export default function BlockMEPluginButton() {
  // trigger initial QRM update
  updateQRMs()
    .then((response) => {
      console.log("Update of QRMs completed: ", response);
      NotificationHandler.getInstance().displayNotification({
        type: "info",
        title: "Successfully updated QRMs",
        content:
          "Loaded " + response.length + " QRMs from configured repository!",
        duration: 4000,
      });
    })
    .catch((e) => {
      NotificationHandler.getInstance().displayNotification({
        type: "warning",
        title: "Unable to load QRMs",
        content: e.toString(),
        duration: 20000,
      });
    });

  return (
    <ExtensibleButton
      subButtons={[
        <QuantMEController />,
      ]}
      title="BlockME"
      styleClass="blockme-logo"
      description="Show buttons of the BlockME plugin"
    />
  );
}
