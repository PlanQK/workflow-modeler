import React, { useState } from "react";
import { saveModelerAsLocalFile } from "../util/IoUtilities";

/**
 * React button which saves the current workflow to the users local file system when clicked
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function SaveButton(props) {

    const { modeler } = props;
    const [bpmnFileChecked, setBpmnFileChecked] = useState(false);

    const [svgFileChecked, setSvgFileChecked] = useState(false);
    const [pngFileCheck, setPngFileChecked] = useState(false)
    const [isToggleOn, setToggleOn] = useState(false);

    const handleBpmnCheckboxChange = () => {
        setBpmnFileChecked(!bpmnFileChecked);
    };

    const handleSvgCheckboxChange = () => {
        setSvgFileChecked(!svgFileChecked);
    };

    const handlePngCheckboxChange = () => {
        setPngFileChecked(!pngFileCheck);
    };

    function handleClick() {
        setToggleOn(!isToggleOn);
    }

    return (
        <div>
            <button className={isToggleOn ? 'qwm-extensible-btn' : 'qwm-toolbar-btn'}
                    title="Save workflow">
                <div style={{display: 'flex'}}>
                    <div style={{display: 'flex',}}>
                    <span className={"qwm-icon-saving"} onClick={() => saveModelerAsLocalFile(modeler, bpmnFileChecked, pngFileCheck, svgFileChecked)}>
                        <span className="qwm-indent">Save</span>
                    </span>

                    </div>
                    <hr className="qwm-toolbar-splitter"/>
                    <div className="qwm-toolbar-transformation-btn" style={{display: 'flex'}} onClick={handleClick}>
                        <span className="qwm-toolbar-transformation-edit-icon">
                            <span className="qwm-indent"/>
                        </span>
                    </div>
                </div>
            </button>

            { isToggleOn && 
                <div className="qwm-extensible-buttons-list">
                    <div style={{ display: 'flex' }} className="qwm-toolbar-btn">
                        <input type="checkbox" style={{ margin: '0 0 0 5px' }} onChange={handleBpmnCheckboxChange} checked={bpmnFileChecked} />
                        <button type="button" className="qwm-toolbar-btn" style={{ margin: '0 0 0 0' }}
                            title={"Save workflow as BPMN file"}>
                            <span className={"qwm-icon-saving"}>
                                <span className="qwm-indent">{'BPMN File'}</span>
                            </span>
                        </button>

                        <input type="checkbox" style={{ margin: '0 0 0 5px' }} onChange={handleSvgCheckboxChange} checked={svgFileChecked} />
                        <button type="button" className="qwm-toolbar-btn" style={{ margin: '0 0 0 0' }}
                            title={"Save workflow as SVG file"}>
                            <span className={"qwm-icon-saving"}>
                                <span className="qwm-indent">{'SVG File'}</span>
                            </span>
                        </button>

                        <input type="checkbox" style={{ margin: '0 0 0 5px' }} onChange={handlePngCheckboxChange} checked={pngFileCheck} />
                        <button type="button" className="qwm-toolbar-btn" style={{ margin: '0 0 0 0' }}
                            title={"Save workflow as PNG file"}>
                            <span className={"qwm-icon-saving"}>
                                <span className="qwm-indent">{'PNG File'}</span>
                            </span>
                        </button>

                    </div>
                </div>
            }
        </div>
    );
}