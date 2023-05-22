import {SelectEntry} from "@bpmn-io/properties-panel";
import React from "@bpmn-io/properties-panel/preact/compat";
import {useService} from "bpmn-js-properties-panel";

/**
 * Copyright (c) 2023 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Entry to display the endpoints of the uploaded openapi specification for BPMN service task. 
 */
export function Connector({element, translate, urls}) {

    const modeling = useService('modeling');
    const debounce = useService('debounceInput');

    let arrValues = [];
    for (let i = 0; i< urls.length; i++) {
        arrValues.push({
            label: urls[i],
            value: urls[i]
        });
    }

    const selectOptions = function (element) {
        return arrValues;
    }

    const get = function () {
        return element.businessObject.get('quantme:connectorUrl');
    };

    const setValue = function (value) {
        return modeling.updateProperties(element, {connectorUrl: value || ''});
    };


    return <>
        {(<SelectEntry
            id={'connector'}
            label={translate('Connector Name')}
            getValue={get}
            setValue={setValue}
            getOptions={selectOptions}
            debounce={debounce}
        />)}
    </>;
}