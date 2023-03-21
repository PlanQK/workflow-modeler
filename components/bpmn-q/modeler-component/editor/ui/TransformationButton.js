import React from "react"
import {startReplacementProcess} from "../../extensions/planqk/exec-completion/PlanqkServiceTaskCompletion";
import {getXml, saveXmlAsLocalFile} from "../../common/util/IoUtilities";

export default function TransformationButton(props) {

    const {
        // modeler,
        transformWorkflow,
    } = props;

    // async function transformWorkflow() {
    //     let xml = await getXml(modeler);
    //
    //     await startReplacementProcess(xml, async function (xml) {
    //         await saveXmlAsLocalFile(xml, "myProcess.bpmn");
    //     });
    // }

    return (
        <button type="button" className="toolbar-btn" title="Transform the current workflow"
                onClick={() => transformWorkflow()}>
            <span className="workflow-transformation"><span className="indent">Transformation</span></span>
        </button>
    )
}