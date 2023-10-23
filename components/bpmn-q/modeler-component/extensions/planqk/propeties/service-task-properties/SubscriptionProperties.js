import {
  isTextFieldEntryEdited,
  TextAreaEntry,
} from "@bpmn-io/properties-panel";
import { useService } from "bpmn-js-properties-panel";

/**
 * Properties group for subscription details of PlanQK service tasks.
 *
 * @param element The PlanQK service task element
 * @return {[{component: (function(*): preact.VNode<any>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): preact.VNode<any>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): preact.VNode<any>), isEdited: ((function(*): *)|*), id: string, element}]}
 * @constructor
 */
export default function (element) {
  return [
    {
      id: "applications",
      element,
      component: Applications,
      isEdited: isTextFieldEntryEdited,
    },

    {
      id: "subscribedServices",
      element,
      component: SubscribedServices,
      isEdited: isTextFieldEntryEdited,
    },

    {
      id: "subscriptionId",
      element,
      component: SubscriptionId,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

/**
 * TextAreaEntry for the application name property of the PlanQK service task.
 */
function Applications(props) {
  const { element } = props;

  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => {
    return (
      element.businessObject.applicationName ||
      "Select an application and service"
    );
  };

  return TextAreaEntry({
    element,
    id: "subscribing_app_name",
    label: translate("Application"),
    getValue,
    disabled: true,
    debounce,
    rows: 1,
  });
}

/**
 * TextAreaEntry for the service name property of the PlanQK service task.
 */
function SubscribedServices(props) {
  const { element } = props;

  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => {
    return (
      element.businessObject.serviceName || "Select an application and service"
    );
  };

  return TextAreaEntry({
    element,
    id: "subscribed_service_name",
    label: translate("Service"),
    getValue,
    disabled: true,
    debounce,
    rows: 1,
  });
}

/**
 * TextAreaEntry for the subscription ID property of the PlanQK service task.
 */
function SubscriptionId(props) {
  const { element } = props;

  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => {
    return element.businessObject.subscriptionId || "undefined";
  };

  return TextAreaEntry({
    element,
    id: "subscription_id",
    label: translate("Subscription Id"),
    getValue,
    disabled: true,
    debounce,
    rows: 1,
  });
}
