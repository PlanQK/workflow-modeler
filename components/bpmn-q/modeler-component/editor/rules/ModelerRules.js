import BpmnRules from 'bpmn-js/lib/features/rules/BpmnRules';
import { getModeler } from '../ModelerHandler';
import { saveModelerAsLocalFile } from '../util/IoUtilities';

/**
 * Contains the rules for the modeler.
 */
export default class ModelerRules extends BpmnRules {

    constructor(eventBus) {
        super(eventBus);
        eventBus.on('saveFile', function(context) {
            saveModelerAsLocalFile(getModeler());
          });
    }
}

ModelerRules.$inject = [
    'eventBus',
];

