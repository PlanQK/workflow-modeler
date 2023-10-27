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

import React, { useState, useCallback } from "react";
import Modal from "../../../../editor/ui/modal/Modal";
import PatternSelectionModal from "./PatternSelectionModal";

const Title = Modal.Title || (({ children }) => <h4>{children}</h4>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function PatternOverviewModal({ onClose, responseData }) {
  const [buttonSelectedPatterns, setButtonSelectedPatterns] = useState({});
  const [isAlgorithmicPatternModalOpen, setAlgorithmicPatternModalOpen] =
    useState(false);
  const [dynamicRows, setDynamicRows] = useState([]);
  const [editRow, setEditRow] = useState(null); // State to store the row being edited
  const [editRowData, setEditRowData] = useState(null);

  const openAlgorithmicPatternModal = () => {
    setAlgorithmicPatternModalOpen(true);
  };

  const closeAlgorithmicPatternModal = () => {
    setAlgorithmicPatternModalOpen(false);
  };

  const selectAlgorithmicPattern = useCallback(
    (selectedPattern) => {
      if (editRow !== null) {
        const updatedRows = [...dynamicRows];
        updatedRows[editRow].algorithmPattern = selectedPattern.algorithm;
        let behavioralPattern = selectedPattern.behavioral;

        updatedRows[editRow].behavioralPattern = behavioralPattern;
        let augmentationPattern = selectedPattern.augmentation;

        updatedRows[editRow].augmentationPattern = augmentationPattern;
        setDynamicRows(updatedRows);
        setEditRow(null);
        setEditRowData(null);
      } else {
        const newButtonLabel = selectedPattern.name;
        const algorithmPattern = selectedPattern.algorithm;
        const behavioralPattern = selectedPattern.behavioral;
        const augmentationPattern = selectedPattern.augmentation;
        const newRowData = {
          algorithmPattern: algorithmPattern,
          behavioralPattern: behavioralPattern,
          augmentationPattern: augmentationPattern,
        };
        setDynamicRows([...dynamicRows, newRowData]);
        setButtonSelectedPatterns({
          ...buttonSelectedPatterns,
          [newButtonLabel]: [],
        });
      }
      closeAlgorithmicPatternModal();
    },
    [buttonSelectedPatterns, dynamicRows, editRow]
  );

  const moveRowUp = (index) => {
    if (index > 0) {
      const updatedRows = [...dynamicRows];
      const temp = updatedRows[index - 1];
      updatedRows[index - 1] = updatedRows[index];
      updatedRows[index] = temp;
      setDynamicRows(updatedRows);
    }
  };

  const moveRowDown = (index) => {
    if (index < dynamicRows.length - 1) {
      const updatedRows = [...dynamicRows];
      const temp = updatedRows[index + 1];
      updatedRows[index + 1] = updatedRows[index];
      updatedRows[index] = temp;
      setDynamicRows(updatedRows);
    }
  };

  const deleteRow = (index) => {
    const updatedRows = [...dynamicRows];
    updatedRows.splice(index, 1);
    setDynamicRows(updatedRows);
  };

  const openEditRow = (index) => {
    const rowToEdit = dynamicRows[index];
    setEditRowData(rowToEdit);
    setEditRow(index);
    openAlgorithmicPatternModal();
  };

  return (
    <Modal onClose={onClose}>
      <Title>Pattern Selection</Title>

      <Body>
        <h3>
          Selected Patterns{" "}
          <button
            className="qwm-action-add qwm-btn-primary"
            onClick={openAlgorithmicPatternModal}
            disabled={responseData === null}
          >
            +
          </button>
        </h3>
        {isAlgorithmicPatternModalOpen && (
          <PatternSelectionModal
            patterns={responseData}
            onSelectPattern={selectAlgorithmicPattern}
            onClose={closeAlgorithmicPatternModal}
            initialSelectedPattern={editRowData !== null ? editRowData : null}
          />
        )}
        <div className="pattern-type-buttons">
          <div className="dynamic-buttons-container">
            <table>
              <thead>
                <tr>
                  <th>Algorithm Pattern</th>
                  <th>Behavioral Pattern</th>
                  <th>Augmentation Pattern</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dynamicRows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={row.algorithmPattern.iconUrl}
                        title={row.algorithmPattern.name}
                        alt={`Algorithm Pattern`}
                        style={{ width: "30%", height: "auto" }}
                      />
                    </td>
                    <td>
                      {row.behavioralPattern.map((behavioralItem, index) => (
                        <img
                          key={index}
                          src={behavioralItem.iconUrl}
                          title={behavioralItem.name}
                          alt={`Behavioral Pattern ${index}`}
                          style={{ width: "30%", height: "auto" }}
                        />
                      ))}
                    </td>
                    <td>
                      {row.augmentationPattern.map(
                        (augmentationItem, index) => (
                          <img
                            key={index}
                            src={augmentationItem.iconUrl}
                            title={augmentationItem.name}
                            alt={`Augmentation Pattern ${index}`}
                            style={{ width: "30%", height: "auto" }}
                          />
                        )
                      )}
                    </td>
                    <td className="actions-column">
                      <button
                        className={`qwm-action qwm-btn-primary${
                          index === 0 ? " disabled" : ""
                        }`}
                        onClick={() => moveRowUp(index)}
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button
                        className={`qwm-action qwm-btn-primary${
                          index === dynamicRows.length - 1 ? " disabled" : ""
                        }`}
                        onClick={() => moveRowDown(index)}
                        disabled={index === dynamicRows.length - 1}
                      >
                        ↓
                      </button>
                      <button
                        className="qwm-action qwm-btn-primary"
                        onClick={() => openEditRow(index)}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        className="qwm-action qwm-btn-primary"
                        onClick={() => deleteRow(index)}
                      >
                        <i className="fa fa-close"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Body>

      <Footer>
        <div id="hybridLoopAdaptationFormButtons">
          <button
            type="button"
            className="qwm-btn qwm-btn-secondary"
            onClick={() => onClose(dynamicRows)}
          >
            Done
          </button>
        </div>
      </Footer>
    </Modal>
  );
}
