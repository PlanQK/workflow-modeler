# Extend the UI
The modeler allows plugins to extend its UI. A plugin can therefore specify react components in its plugin object which are
loaded into the UI of the modeler. There are two was a plugin can extend the UI:

## Toolbar Button
Each Plugin can define buttons which will be added to the toolbar of the modeler. To add buttons to the toolbar, a plugin has
to specify these buttons in the ```buttons``` attribute of its plugin object. An Extensible Button can be used to
group several buttons into one. This allows a plugin to integrate buttons to start custom functions it defines.

In the following example, the plugin defines a custom entry for the toolbar which consists of an Extensible Button which 
has several sub buttons. These buttons are displayed horizontal next to each other when the user clicks on the extensible 
buttons.
```javascript
export default {
    
    // ...
    
    buttons: [<ExtensibleButton
        subButtons={[<Button1/>, <Button2/>, <Button2/>, <Button3/>]}
        title="MyPluginButtons"
        styleClass="my-plugin-logo"
        description="Show buttons of the my plugin"/>],
    
    // ...
}
```

## Config Tabs
Each plugin can define an array of config tabs which will be displayed in the configuration dialog of the modeler. These 
tabs can be defined in the ```configTabs``` attribute of the plugin object. Each entry of such an entry defines ```tabId```,
```tabTitel``` and ```configTab```:
- tabId: Unique identifier of the config tab.
- tabTitle: Title of the tab. Displayed on top of the tab in the config modal.
- configTab: React component defining the tab. Defines the entries of the tab, e.g. as a table.

In the following code, a plugin specifies two tabs.
```javascript

export default {
    
    // ...
    
    configTabs: [
        {
            tabId: 'configTab1',
            tabTitle: 'Endpoint Setup',
            configTab: EndpointSetupTab,
        },
        {
            tabId: 'configTab2',
            tabTitle: 'Docker Setup',
            configTab: DockerSetupTab,
        },
    ],
    
    // ...
};
```

A config tab is a React component which defines the structure of the tab which will be displayed in the config modal if the
tab is selected. The structure can be defined as necessary, however in the most cases a table may be a good choice to 
structure the entries which should be configured in the tab. The tab component has to implement a ```onClose``` function
which will be called by the modal dialog if the modal is closed. This function can be used to save the changed values.

The following example shows a config tab which allows the user to configure a docker endpoint. Therefore, it defines its inner
structure as a table with one entry to edit the docker endpoint. In the ```onClose``` function, the value of the docker 
endpoint configured by this tab is saved in an configManager.
```javascript
export default function DockerSetupTab() {

    // save docker endpoint value as state
    const [dockerEndpoint, setDockerEndpoint] = useState(editorConfig.getDockerEndpoint());

    const modeler = getModeler();

    // save value for docker endpoint in the editor config
    DockerSetupTab.prototype.onClose = () => {
        
        // save state in config manager
        configManager.setDockerEndpoint(dockerEndpoint);
    };

    // return tab which contains entries to change the docker endpoint
    return (<>
        <h3>Docker endpoint:</h3>
        <table>
            <tbody>
            <tr className="spaceUnder">
                <td align="right">Docker Engine Endpoint</td>
                <td align="left">
                    <input
                        type="string"
                        name="dockerEndpoint"
                        value={dockerEndpoint}
                        onChange={event => setDockerEndpoint(event.target.value)}/>
                </td>
            </tr>
            </tbody>
        </table>
    </>);
}
```

