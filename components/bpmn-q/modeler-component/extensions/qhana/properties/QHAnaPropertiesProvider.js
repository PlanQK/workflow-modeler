import ConfigurationsProperties from "../../../editor/configurations/ConfigurationsProperties";
import { is } from "bpmn-js/lib/util/ModelUtil";
import * as consts from "../QHAnaConstants";
import * as configConsts from "../../../editor/configurations/Constants";
import qhanaServiceStepProperties from "./QHAnaServiceStepProperties";
import { instance as qhanaServiceConfigs } from "../configurations/QHAnaConfigurations";

const LOW_PRIORITY = 500;

/**
 * A provider of the properties panel of the bpmn-js modeler. Provides custom groups for QHAna service types.
 *
 * @param propertiesPanel The properties panel this provider is registered at.
 * @param {Function} translate The translate function of the bpmn-js modeler.
 * @param injector The injector of the bpmn-js modeler which can be used to load dependencies
 */
export default function QHAnaPropertiesProvider(
  propertiesPanel,
  translate,
  injector
) {
  /**
   * Return the groups provided for the given element.
   *
   * @param element The element the groups are requested for.
   *
   * @return groups middleware
   */
  this.getGroups = function (element) {
    return function (groups) {
      // add properties group to display the configuration attributes of a QHAna service task
      if (is(element, consts.QHANA_SERVICE_TASK)) {
        // load configuration which is applied to the element
        const selectedConfiguration =
          qhanaServiceConfigs().getQHAnaServiceConfiguration(
            element.businessObject.get(configConsts.SELECT_CONFIGURATIONS_ID)
          );

        if (selectedConfiguration) {
          // create respective properties group
          groups.splice(
            1,
            0,
            createQHAnaServiceTaskGroup(
              element,
              injector,
              translate,
              selectedConfiguration
            )
          );
        }
      }

      // add properties group to display the properties of a QHAna service step task
      if (is(element, consts.QHANA_SERVICE_STEP_TASK)) {
        groups.splice(
          1,
          0,
          createQHAnaServiceStepTaskGroup(element, injector, translate)
        );
      }

      return groups;
    };
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

QHAnaPropertiesProvider.$inject = ["propertiesPanel", "translate", "injector"];

/**
 * Create a properties group which contains entries for the properties defined by the given configuration.
 *
 * @param element The currently selected workflow element
 * @param injector The injector of the bpmn-js modeler
 * @param translate The translate function of the bpmn.js modeler
 * @param configuration The given configuration
 * @return {{entries: (*), id: string, label}}
 */
function createQHAnaServiceTaskGroup(
  element,
  injector,
  translate,
  configuration
) {
  return {
    id: "QHAnaServiceTaskGroupProperties",
    label: translate(configuration.groupLabel || "Configurations Properties"),
    entries: ConfigurationsProperties(
      element,
      injector,
      translate,
      configuration
    ),
  };
}

/**
 * Create a group which displays the properties of a QHAna service step task.
 *
 * @param element The QHAna service step task
 * @param injector The injector of the bpmn-js modeler
 * @param translate The translate function of the bpmn.js modeler
 * @return {{entries: ([{component: function(*): VNode<*>, isEdited: function(*): *, id: string, element: *}]|*), id: string, label}}
 */
function createQHAnaServiceStepTaskGroup(element, injector, translate) {
  return {
    id: "QHAnaServiceStepTaskGroupProperties",
    label: translate("Service Step Properties"),
    entries: qhanaServiceStepProperties(element, injector, translate),
  };
}
