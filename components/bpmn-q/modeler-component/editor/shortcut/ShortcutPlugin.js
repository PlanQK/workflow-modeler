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

import ShortcutModal from "../shortcut/ShortcutModal";

export default class ShortcutPlugin extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            shortcutOpen: false,
        };

        this.handleConfigClosed = this.handleConfigClosed.bind(this);
    }

    // callback function to close the shortcut modal
    handleConfigClosed() {
        this.setState({shortcutOpen: false});
    }

    render() {

        // render button and pop-up menu
        return (<Fragment>
            <div style={{display: 'flex'}} slot="toolbar">
                <button type="button" className="qwm-shortcuts" title="Toggle keyboard shortcuts overlay"
                        onClick={() => this.setState({shortcutOpen: true})}>
                    <span className="qwm-icon-shortcut"><span className="indent">Shortcuts</span></span>
                </button>
            </div>
            {this.state.shortcutOpen && (
                <ShortcutModal
                    onClose={this.handleConfigClosed}
                />
            )}
        </Fragment>);
    }
}
