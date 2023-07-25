import React from 'react';
import AdaptationPlugin from "./adaptation/AdaptationPlugin";
import QuantMEController from "./control/QuantMEController";
import UpdateDataObjectConfigurationsButton from "../configurations/UpdateDataObjectConfigurationsButton";
import DeploymentPlugin from "./deployment/services/DeploymentPlugin";
import ExtensibleButton from "../../../editor/ui/ExtensibleButton";
import NotificationHandler from "../../../editor/ui/notifications/NotificationHandler";
import {updateQRMs} from "../qrm-manager";

export default function QuantMEPluginButton() {

  // trigger initial QRM update
  updateQRMs().then(response => {
    console.log('Update of QRMs completed: ', response);
    NotificationHandler.getInstance().displayNotification({
      type: 'info',
      title: 'Successfully updated QRMs',
      content: 'Loaded ' + response.length + ' QRMs from configured repository!',
      duration: 4000
    });
  }).catch(e => {
    NotificationHandler.getInstance().displayNotification({
      type: 'warning',
      title: 'Unable to load QRMs',
      content: e.toString(),
      duration: 20000
    });
  });

  return <ExtensibleButton
    subButtons={[<AdaptationPlugin/>, <QuantMEController/>, <UpdateDataObjectConfigurationsButton/>,
      <DeploymentPlugin/>]}
    title="QuantME"
    styleClass="quantme-logo"
    description="Show buttons of the QuantME plugin"/>;
}