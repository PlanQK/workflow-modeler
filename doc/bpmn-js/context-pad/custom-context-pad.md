# Context Pad Provider
Used to define the entries of the context pad. Allows the definition of custom entries or a custom set by adding or removing actions.

```javascript
import {
  assign,
  forEach,
  isArray,
  every
} from 'min-dash';
import {
  is,
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';
import * as consts from '../Constants';

/**
 * A provider for custom elements context pad
 */
export default class DataFlowContextPadProvider extends ContextPadProvider{

  constructor(config, injector, eventBus, contextPad, modeling, elementFactory,
              connect, create, popupMenu, canvas, rules, translate) {
    super(config, injector, eventBus, contextPad, modeling, elementFactory, connect, create, popupMenu, canvas, rules, translate);

    config = config || {};

    contextPad.registerProvider(this);

    this._contextPad = contextPad;

    this._modeling = modeling;

    this._elementFactory = elementFactory;
    this._connect = connect;
    this._create = create;
    this._popupMenu = popupMenu;
    this._canvas = canvas;
    this._rules = rules;
    this._translate = translate;

    if (config.autoPlace !== false) {
      this._autoPlace = injector.get('autoPlace', false);
    }

    // this.getSuperEntries = this.__proto__.__proto__.getContextPadEntries;

    // this.__proto__.__proto__.getContextPadEntries = this.getContextPadEntries;
  }

  getContextPadEntries(element) {

    console.log('getContextPadEntries')

    const contextPad = this._contextPad,
      modeling = this._modeling,
      elementFactory = this._elementFactory,
      connect = this._connect,
      create = this._create,
      popupMenu = this._popupMenu,
      rules = this._rules,
      autoPlace = this._autoPlace,
      translate = this._translate;

    let actions = super.getContextPadEntries(element);
    const businessObject = element.businessObject;

    if (is(businessObject, consts.DATA_MAP_OBJECT)) {

      // console.log('delete actions');
      // console.log(actions);

      delete actions['append.gateway'];
      delete actions['append.append-task'];
      delete actions['append.intermediate-event'];
      delete actions['append.end-event'];
      // delete actions['append.text-annotation'];


      // console.log(actions);
      // assign(actions, {
      //     'append.receive-task': appendAction(
      //         'bpmn:ReceiveTask',
      //         'bpmn-icon-receive-task',
      //         translate('Append ReceiveTask')
      //     ),
      // });

    }

    // function createServiceTask(event) {
    //     const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });
    //
    //     create.start(event, shape);
    // }
    //
    // const customEntry = {
    //     'create.service-task': {
    //         group: 'activity',
    //         className: 'bpmn-icon-service-task',
    //         title: translate('Create ServiceTask'),
    //         action: {
    //             dragstart: createServiceTask,
    //             click: createServiceTask
    //         }
    //     }
    // }
    //
    // assign(actions, customEntry);

    // console.log(actions);

    return actions;
  }
}

DataFlowContextPadProvider.$inject = [
  'config.contextPad',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'popupMenu',
  'canvas',
  'rules',
  'translate'
];

```