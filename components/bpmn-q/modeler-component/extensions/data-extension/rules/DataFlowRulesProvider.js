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
    const canCreate = this.canCreate.bind(this);

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

    this.addRule('elements.create', 200000000000, function (context) {
      console.log('elements.create')

      var elements = context.elements,
        position = context.position,
        target = context.target;

      // if (isConnection(target) && !canInsert(elements, target, position)) {
      //     return false;
      // }
      let b = true;


      forEach(elements, function (element) {
        if (isConnection(element)) {
          b = b && canConnectDataExtension(element.source, element.target);
        }

        // if (element.host) {
        //     b = canAttach(element, element.host, null, position);
        // }
        //
        // return canCreate(element, target, null, position);
      });
      return b;
    });

    this.addRule('shape.create', 200000000000,function (context) {
      console.log('shape create');
      return canCreate(
        context.shape,
        context.target,
        context.source,
        context.position
      );
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

  canCreate(shape, target, source, position) {
    console.log('can create');

    if (is(shape, 'data:DataObjectMapReference')) {
      console.log('is object map');

      if (is(target, 'bpmn:SequenceFlow')) {
        console.log('is sequence flow');
        return false;
      }

      if (is(target, 'bpmn:DataAssociation')) {
        console.log('is data association');
        return false;
      }
    }

    return super.canCreate(shape, target, source, position);
  }
}
CustomRulesProvider.$inject = [
  'eventBus',
];

