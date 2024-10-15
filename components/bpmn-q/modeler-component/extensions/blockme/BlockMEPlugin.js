import React from "react";

import BlockMEExtensionModule from "./modeling";

import TransformationButton from "../../editor/ui/TransformationButton";
import blockmeStyles from "./resources/styling/blockme.css";
import BlockMEConfigTab from "../blockme/configTabs/BlockMEConfigTab";
import {getModeler} from "../../editor/ModelerHandler";
import {getQRMs} from "./qrm-manager";
import {startBlockmeReplacementProcess} from "./replacement/BlockMETransformator";
import {createBlockMEView, updateBlockMEView} from "./replacement/BlockMEViewGenerator";
import BlockMEPluginButton from "./ui/BlockMEPluginButton";

let blockModdleExtension = require("./resources/blockme.json");

/**
 * Plugin Object of the QuantME extension. Used to register the plugin in the plugin handler of the modeler.
 */
export default {
    buttons: [<BlockMEPluginButton/>],
    configTabs: [
        {
            tabId: "BlockMEConfigTab",
            tabTitle: "BlocME Plugin",
            configTab: BlockMEConfigTab,
        },
    ],
    name: "blockme",
    extensionModule: BlockMEExtensionModule,
    moddleDescription: blockModdleExtension,
    styling: [blockmeStyles],
    transformExtensionButton: (
        <TransformationButton
            name="BlockME Transformation"
            transformWorkflow={async (xml) => {
                let quantumView = await createBlockMEView(xml);
                let modeler = getModeler();
                // Initialize 'views' as an empty object if it's undefined
                modeler.views = modeler.views || {};
                modeler.views["view-before-rewriting"] = quantumView.xml;

                let currentQRMs = getQRMs();
                let transformedXml = await startBlockmeReplacementProcess(xml, currentQRMs);

                if (transformedXml.status === "transformed") {
                    let combinedResult = await updateBlockMEView(
                        quantumView.xml,
                        transformedXml.xml
                    );
                    modeler.views["view-before-rewriting"] = combinedResult.xml;
                }

                return transformedXml;
            }}
        />
    ),
};
