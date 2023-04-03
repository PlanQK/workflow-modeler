import BpmnRules from 'bpmn-js/lib/features/rules/BpmnRules';
import {
  is,
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import * as consts from '../Constants'

export default class CustomRulesProvider extends BpmnRules {

  constructor(eventBus) {
    super(eventBus);

    const canConnectDataExtension = this.canConnectDataExtension;
    const canConnect = this.canConnect.bind(this);

    /**
     * Fired during creation of a new connection (while you selected the target of a connection)
     */
    this.addRule('connection.create', 200000, function (context) {

      const source = context.source,
        target = context.target;

      return canConnect(source, target)
    });

    /**
     * Fired when a connection between two elements is drawn again, e.g. after dragging an element
     */
    this.addRule('connection.reconnect', 200000000000, function (context) {

      const source = context.source,
        target = context.target;

      let canConnectData = canConnectDataExtension(source, target);

      if (canConnectData || canConnectData === false) {
        return canConnectData;
      }
    });
  }

  canConnect(source, target, connection) {

    if (is(source, consts.DATA_MAP_OBJECT) || is(target, consts.DATA_MAP_OBJECT)) {
      return this.canConnectDataExtension(source, target);
    }

    if (!is(connection, 'bpmn:DataAssociation')) {

      if (this.canConnectSequenceFlow(source, target)) {
        return {type: 'bpmn:SequenceFlow'};
      }
    }

    return super.canConnect(source, target, connection);
  }

  canConnectSequenceFlow(source, target) {
    console.log('canConnectSequenceFlow');

    if (is(source, consts.DATA_MAP_OBJECT) || is(target, consts.DATA_MAP_OBJECT)) {
      this.canConnectDataExtension(source, target)
      return;
    }

    return super.canConnectSequenceFlow(source, target);
  }

  canConnectDataExtension(source, target) {

    // add rule for connections via a DataTransformationAssociation
    if (isAny(source, [consts.DATA_MAP_OBJECT]) &&
      isAny(target, [consts.DATA_MAP_OBJECT])) {
      console.log('Create connection between DataMapObjects with ' + consts.OUTPUT_TRANSFORMATION_ASSOCIATION);
      return {type: consts.OUTPUT_TRANSFORMATION_ASSOCIATION}
    }

    // the normal rules for a DataObject
    if (isAny(source, [consts.DATA_MAP_OBJECT]) && isAny(target, ['bpmn:Activity', 'bpmn:ThrowEvent'])) {
      console.log('Map to act')
      return {type: 'bpmn:DataInputAssociation'}
    }
    if (isAny(target, [consts.DATA_MAP_OBJECT]) && isAny(source, ['bpmn:ThrowEvent'])) {
      console.log('Map to act');
      return false;
    }
    if (isAny(target, [consts.DATA_MAP_OBJECT]) && isAny(source, ['bpmn:Activity', 'bpmn:CatchEvent'])) {
      return {type: 'bpmn:DataOutputAssociation'}
    }
    if (isAny(source, [consts.DATA_MAP_OBJECT]) && isAny(target, ['bpmn:CatchEvent'])) {
      return false;
    }

    // restrict connections via sequence flow
    if (isAny(source, [consts.DATA_MAP_OBJECT]) &&
      isAny(target, ['bpmn:DataObjectReference', 'bpmn:DataStoreReference', 'bpmn:Gateway'])) {
      console.log('No data association between DataObjectMap and DataObjectReference.');
      return false;
    }
    if (isAny(source, ['bpmn:DataObjectReference', 'bpmn:DataStoreReference', 'bpmn:Gateway']) &&
      isAny(target, [consts.DATA_MAP_OBJECT])) {
      return false;
    }
  }
}
CustomRulesProvider.$inject = [
  'eventBus',
];

