import React, { useState } from "react";
import { getModeler } from "../ModelerHandler";
import ace from "ace-builds";
import { loadDiagram } from "../util/IoUtilities";

/**
 * React button which enables the XML Viewer.
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function XMLViewerButton() {
  const [enabledXMLView, setEnabledXMLView] = useState(false);

  function update(aceEditor) {
    let xml = aceEditor.getSession().getValue();
    loadDiagram(xml, getModeler());
  }

  function enableXMLViewer(enabledXMLView) {
    let modelerContainer = document.getElementById("modeler-container");
    let editor = document.getElementById("editor");
    let editorWrap = document.getElementById("editor_wrap");
    let panel = document.getElementById("properties");
    let aceEditor = ace.edit(editor);
    if (!enabledXMLView) {
      modelerContainer.style.height = "93vh";
      editor.style.display = "block";
      const minLines = aceEditor.getOption("minLines");
      const maxLines = aceEditor.getOption("maxLines");
      editor.style.height = "93vh";
      aceEditor.setOptions({
        vScrollBarAlwaysVisible: true,
        minLines: minLines,
        maxLines: maxLines,
      });
      aceEditor.resize(true);
      panel.style.display = "none";
      editorWrap.style.display = "block";

      // Dynamically set the value of the editor
      let xml = getModeler().xml;
      if (xml.xml != undefined) {
        xml = xml.xml;
      }
      aceEditor.setValue(xml);
    } else {
      modelerContainer.style.height = "98vh";
      editor.style.display = "none";
      panel.style.display = "block";
      editorWrap.style.display = "none";

      aceEditor.getSession().on("change", function () {
        update(aceEditor);
      });
    }

    setEnabledXMLView(!enabledXMLView);
  }

  return (
    <button
      className="qwm-toolbar-btn"
      title="Trigger XML Viewer"
      onClick={() => enableXMLViewer(enabledXMLView)}
    >
      <span className="qwm-icon-xml-viewer">
        <span className="qwm-indent"></span>
      </span>
    </button>
  );
}
