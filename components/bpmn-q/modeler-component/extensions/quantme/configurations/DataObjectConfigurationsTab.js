import React, {useState} from 'react';
import * as configManager from '../framework-config/config-manager';

/**
 * React component specifying a tab for the configuration dialog of the modeler. The tab allows the user to change the
 * endpoint url which is used to load the configurations for the DataMapObjects from.
 *
 * @return {JSX.Element} The tab as a React component
 * @constructor
 */
export default function DataObjectConfigurationsTab() {

    const [dataConfigurationsEndpoint, setDataConfigurationsEndpoint] = useState(configManager.getQuantMEDataConfigurationsEndpoint());

    // save the value of the endpoint in the QuantME config
    DataObjectConfigurationsTab.prototype.onClose = () => {
        configManager.setQuantMEDataConfigurationsEndpoint(dataConfigurationsEndpoint);
    };

    return (<>
        <h3>QuantME data configuration endpoint:</h3>
        <table>
            <tbody>
            <tr className="spaceUnder">
                <td align="right">Data Configurations Endpoint</td>
                <td align="left">
                    <input
                        type="string"
                        name="dataConfigurationsEndpoint"
                        value={dataConfigurationsEndpoint}
                        onChange={event => setDataConfigurationsEndpoint(event.target.value)}/>
                </td>
            </tr>
            </tbody>
        </table>
    </>);
}

DataObjectConfigurationsTab.prototype.config = () => {
};