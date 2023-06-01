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

/* eslint-disable no-unused-vars */
import React from 'react';
import Modal from '../ui/modal/Modal';
import '../config/config-modal.css';

// polyfill upcoming structural components
const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);

/**
 * Shortcut modal of the editor which displays the operation and the associated keyboard combination.
 *
 * @param onClose Function called when the modal is closed.
 * @returns {JSX.Element} The modal as React component
 * @constructor
 */
export default function ShortcutModal({ onClose }) {

    return <Modal onClose={onClose}>
        <Title>
            Keyboard Shortcuts
        </Title>

        <Body>
            <table>
                <tbody>
                    <tr>
                        <td>Select All</td>
                        <td className="binding"><code>⇧ + A</code></td>
                    </tr>
                    <tr>
                        <td>Search</td>
                        <td className="binding"><code>ctrl + F</code></td>
                    </tr>
                    <tr>
                        <td>Redo</td>
                        <td className="binding"><code>ctrl + Y</code></td>
                    </tr>
                    <tr>
                        <td>Undo</td>
                        <td className="binding"><code>ctrl + Z</code></td>
                    </tr>
                    <tr>
                        <td>Scrolling (Vertical)</td>
                        <td className="binding"><code>ctrl + Scrolling</code></td>
                    </tr>
                    <tr>
                        <td>Scrolling (Horizontal)</td>
                        <td className="binding"><code>ctrl + ⇧ + Scrolling</code></td>
                    </tr>
                    <tr>
                        <td>Delete</td>
                        <td className="binding"><code>D, Backspace</code></td>
                    </tr>
                    <tr>
                        <td>Hand Tool</td>
                        <td className="binding"><code>H</code></td>
                    </tr>
                    <tr>
                        <td>Lasso Tool</td>
                        <td className="binding"><code>L</code></td>
                    </tr>
                    <tr>
                        <td>Replace Tool</td>
                        <td className="binding"><code>R</code></td>
                    </tr>
                    <tr>
                        <td>Space Tool</td>
                        <td className="binding"><code>S</code></td>
                    </tr>
                </tbody>
            </table>
        </Body>
    </Modal>;
}

