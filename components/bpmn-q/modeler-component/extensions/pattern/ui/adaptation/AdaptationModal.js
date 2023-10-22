import React, { useState, useEffect, useCallback } from "react";
import Modal from "../../../../editor/ui/modal/Modal";
import AlgorithmicPatternSelectionModal from "./AlgorithmicPatternSelectionModal";
import NotificationHandler from "../../../../editor/ui/notifications/NotificationHandler";

const Title = Modal.Title || (({ children }) => <h4>{children}</h4>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function AdaptationModal({ onClose, responseData }) {
  const [currentView, setCurrentView] = useState("algorithmic");
  const [buttonSelectedPatterns, setButtonSelectedPatterns] = useState({});
  const [algorithmicPatterns, setAlgorithmicPatterns] = useState([]);
  const [isAlgorithmicPatternModalOpen, setAlgorithmicPatternModalOpen] = useState(false);
  const [dynamicRows, setDynamicRows] = useState([]);
  const [index, setIndex] = useState(0)

  const openAlgorithmicPatternModal = () => {
    setAlgorithmicPatternModalOpen(true);
  };

  const closeAlgorithmicPatternModal = () => {
    setAlgorithmicPatternModalOpen(false);
  };

  const selectAlgorithmicPattern = useCallback((selectedPattern) => {
    const newButtonLabel = selectedPattern.name;
    setIndex(index +1);
    let string = "" + index;
    const newRowData = { algorithmicPattern: selectedPattern.name + string, behavioralPattern: "", augmentationPattern: "" };
    setDynamicRows([...dynamicRows, newRowData]);
    setButtonSelectedPatterns({ ...buttonSelectedPatterns, [newButtonLabel]: [] });
    closeAlgorithmicPatternModal();
  }, [buttonSelectedPatterns, dynamicRows]);

  const switchView = (viewType, buttonLabel) => {
    setCurrentView(viewType);
    setSelectedButton(buttonLabel);
  };

  const handleAddDynamicRow = () => {
    const newRowData = { algorithmicPattern: "", behavioralPattern: "", augmentationPattern: "" };
    setDynamicRows([...dynamicRows, newRowData]);
  };

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

  return (
    <Modal onClose={onClose}>
      <Title>Pattern Selection</Title>

      <Body>
        <h3>Selected Algorithmic Patterns<button onClick={openAlgorithmicPatternModal}>+</button></h3>
        {isAlgorithmicPatternModalOpen && (
          <AlgorithmicPatternSelectionModal
            patterns={responseData}
            onSelectPattern={selectAlgorithmicPattern}
            onClose={closeAlgorithmicPatternModal}
          />
        )}
        <div className="pattern-type-buttons">
          <div className="dynamic-buttons-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Behavioral Pattern Name</th>
                  <th>Augmentation Pattern Name</th>
                  <th>Move Up</th>
                  <th>Move Down</th>
                </tr>
              </thead>
              <tbody>
                {dynamicRows.map((row, index) => (
                  <tr key={index}>
                    <td>{row.algorithmicPattern}</td>
                    <td>{row.behavioralPattern}</td>
                    <td>{row.augmentationPattern}</td>
                    <td>
                      <button onClick={() => moveRowUp(index)}>↑</button>
                    </td>
                    <td>
                      <button onClick={() => moveRowDown(index)}>↓</button>
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
          <button type="button" className="qwm-btn qwm-btn-secondary" onClick={() => onClose()}>
            Done
          </button>
          <button type="button" onClick={handleAddDynamicRow}>+</button>
        </div>
      </Footer>
    </Modal>
  );
}
