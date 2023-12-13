import BpmnRules from "bpmn-js/lib/features/rules/BpmnRules";
import { getModeler } from "../ModelerHandler";
import * as editorConfig from "../config/EditorConfigManager";
import { autoSaveFile } from "../EditorConstants";
import { saveFile, setAutoSaveInterval } from "../util/IoUtilities";
import ace from "ace-builds";

/**
 * Contains the rules for the modeler.
 */
export default class ModelerRules extends BpmnRules {
  constructor(eventBus) {
    super(eventBus);

    // save every change when the autosave option is on action
    eventBus.on("commandStack.changed", function () {
      if (editorConfig.getAutoSaveFileOption() === autoSaveFile.ON_ACTION) {
        saveFile();
      }
    });

    // remove interval when autosave option is on action
    eventBus.on("autoSaveOptionChanged", function (context) {
      if (context.autoSaveFileOption === autoSaveFile.ON_ACTION) {
        clearInterval(getModeler().autosaveIntervalId);
      } else {
        setAutoSaveInterval();
      }
    });

    // update xml viewer on diagram change
    eventBus.on("commandStack.changed", function () {
      let editor = document.getElementById("editor");
      let aceEditor = ace.edit(editor);
      let modeler = getModeler();
      if (modeler) {
        if (modeler.xml !== undefined) {
          modeler.oldXml = getModeler().xml;
          if (getModeler().xml.xml !== undefined)
            modeler.oldXml = getModeler().xml.xml;
        }
        modeler.saveXML({ format: true }).then(function (result) {
          if (result.xml !== undefined) {
            result = result.xml;
          }
          aceEditor.setValue(result);
        });

        // clear views since they become invalid if changes are applied
        modeler.views = [];
      }
    });
  }
}

ModelerRules.$inject = ["eventBus"];
