import React, {PureComponent, useRef} from "react"
import {getXml, loadDiagram} from "../io/IoUtilities";

export default function OpenButton(props){

    const { modeler } = props;

    const inputRef = useRef(null);

    function handleClick() {
        inputRef.current.click();
    }

    function handleChange(event) {
        console.log('Handle change')

        const file = event.target.files[0];

        if (file.name.endsWith('.bpmn')) {
            const reader = new FileReader();
            reader.onload = (e) => {

                const xml = e.target.result;
                loadDiagram(xml, modeler).then();
            };
            reader.readAsText(file);
        }
    }

    return (
        <>
            <input ref={inputRef} className="toolbar-btn" style={{display: 'none'}} type="file" accept=".bpmn" onChange={(event) => handleChange(event)}/>
            <button className="toolbar-btn" onClick={() => handleClick()}>
                <span className="icon-open-file">
                    <span className="indent">Open</span>
                </span>
            </button>
        </>
        );
}