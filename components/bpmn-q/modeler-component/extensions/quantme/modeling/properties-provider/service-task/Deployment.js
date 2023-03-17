import {SelectEntry} from "@bpmn-io/properties-panel";
import * as consts from "../../../Constants";
import React from "@bpmn-io/properties-panel/preact/compat";
import {useService} from "bpmn-js-properties-panel";
import {getServiceTaskLikeBusinessObject} from "../../../../../common/util/camunda-utils/ImplementationTypeUtils";
import {getImplementationType} from "../../../utilities/ImplementationTypeHelperExtension";

/**
 * Copyright (c) 2021 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

// const entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
//       cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

const jquery = require('jquery');

const QUANTME_NAMESPACE_PULL = 'http://quantil.org/quantme/pull';
const QUANTME_NAMESPACE_PUSH = 'http://quantil.org/quantme/push';

export function Deployment({element, translate, wineryEndpoint}) {

  const modeling = useService('modeling');
  const debounce = useService('debounceInput');

  const selectOptions = function(element) {
    const arrValues = [];
    jquery.ajax({
      url: wineryEndpoint + '/servicetemplates/?grouped',
      method :'GET',
      success: function(result) {
        let checks = 0;
        for (let i = 0; i < result.length; i++) {
          if (result[i].text === QUANTME_NAMESPACE_PULL) {
            result[i].children.forEach(element => arrValues.push({ label: element.text, value: concatenateCsarEndpoint('{{ wineryEndpoint }}', result[i].id, element.text) }));
            checks++;
          }
          if (result[i].text === QUANTME_NAMESPACE_PUSH) {
            result[i].children.forEach(element => arrValues.push({ label: element.text, value: concatenateCsarEndpoint('{{ wineryEndpoint }}', result[i].id, element.text) }));
            checks++;
          }
          if (checks === 2) {
            break;
          }
        }
      },
      async: false
    });
    if (arrValues.length === 0) {
      arrValues.push({ label: 'No CSARs available', value:'' });
    }
    return arrValues;
  };
  // setControlValue: true;

  const get = function() {
    let bo = getServiceTaskLikeBusinessObject(element);
    let deploymentModelUrl = bo && bo.get('quantme:deploymentModelUrl');
    return {
      deploymentModelUrl: deploymentModelUrl,
      deploymentModelUrlLabel: translate('CSAR Name')
    };
  };

  const set = function(value) {
    let prop = { deploymentModelUrl: value.deploymentModelUrl || '' };
    return modeling.updateProperties(element, prop) //cmdHelper.updateBusinessObject(element, bo, prop);
  };

  const validate = function(element, values, node) {
    return getImplementationType(element) === 'deploymentModel' && !values.deploymentModelUrl ? { deploymentModelUrl: translate('Must provide a CSAR') } : {};
  };

  const hidden = function() {
    const implType = getImplementationType(element);
    console.log('getImplementationType returns ' + implType);
    const hide = !(implType === 'deploymentModel');
    return hide;
  };

  // const deploymentEntry = entryFactory.selectBox({
  //   id: 'deployment',
  //   label: translate('CSAR Name'),
  //   dataValueLabel: 'deploymentModelUrlLabel',
  //   modelProperty: 'deploymentModelUrl',
  //
  //
  // });

  return <>
    {!hidden() && (<SelectEntry
          id={'deployment'}
          label={translate('CSAR Name')}
          getValue={get}
          setValue={set}
          getOptions={selectOptions}
          validate={validate}
          debounce={debounce}
      />)}
  </>;
}

function concatenateCsarEndpoint(wineryEndpoint, namespace, csarName) {
  return wineryEndpoint + '/servicetemplates/' + encodeURIComponent(namespace) + '/' + csarName + '/?csar';
}
