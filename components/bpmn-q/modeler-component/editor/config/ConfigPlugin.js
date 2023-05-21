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

import React, {PureComponent, Fragment} from 'react';

import ConfigModal from './ConfigModal';
import {getModeler} from "../ModelerHandler";
import {getConfigTabs} from "../plugin/PluginHandler";

export default class ConfigPlugin extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            configOpen: false,
        };

        this.handleConfigClosed = this.handleConfigClosed.bind(this);
    }

    componentDidMount() {

        // get current modeler instance
        this.modeler = getModeler();

        // set up config of the modeler
        if (!this.modeler.config) {
            this.modeler.config = {};

            for (let tab of getConfigTabs()) {
                tab.configTab.prototype.config();
            }
        }
    }

    // callback function to close the config modal
    handleConfigClosed() {
        this.setState({configOpen: false});
    }

    render() {

        // render config button and pop-up menu
        return (<Fragment>
            <div style={{display: 'flex'}} slot="toolbar">
                <button type="button" className="qwm-toolbar-btn" title="Open configuration menu"
                        onClick={() => this.setState({configOpen: true})}>
                    <span className="qwm-btn-config"><span className="indent">Configuration</span></span>
                </button>
            </div>
            {this.state.configOpen && (
                <ConfigModal
                    onClose={this.handleConfigClosed}
                    configTabs={getConfigTabs()}
                />
            )}
        </Fragment>);
    }
}
