import React, {useRef} from 'react';
import {loadDiagram} from '../../common/util/IoUtilities';
import {getModeler} from '../ModelerHandler';
import * as editorConfig from '../config/EditorConfigManager';

export default function OpenButton() {

  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.click();
  }

  function handleChange(event) {

    const file = event.target.files[0];

    if (file.name.endsWith('.bpmn')) {

      // open file and load its content as bpmn diagram in the modeler
      const reader = new FileReader();
      reader.onload = (e) => {

        const xml = e.target.result;

        loadDiagram(xml, getModeler()).then(() => {
          // save file name in editor configs
          editorConfig.setFileName(file.name);
        });
      };
      reader.readAsText(file);
    }
  }

  return (
    <>
      <input ref={inputRef} className="toolbar-btn" style={{display: 'none'}} type="file" accept=".bpmn"
             onChange={(event) => handleChange(event)}/>
      <button className="toolbar-btn" onClick={() => handleClick()}>
                <span className="icon-open-file">
                    <span className="indent">Open</span>
                </span>
      </button>
    </>
  );
}