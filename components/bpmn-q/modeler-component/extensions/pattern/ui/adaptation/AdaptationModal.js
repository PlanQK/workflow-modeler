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
  const [algorithmPatterns, setAlgorithmPatterns] = useState([]);
  const [isAlgorithmicPatternModalOpen, setAlgorithmicPatternModalOpen] = useState(false);
  const [dynamicRows, setDynamicRows] = useState([]);
  const [editRow, setEditRow] = useState(null); // State to store the row being edited
  const [editRowData, setEditRowData] = useState(null);

  const openAlgorithmicPatternModal = () => {
    setAlgorithmicPatternModalOpen(true);
  };

  const closeAlgorithmicPatternModal = () => {
    setAlgorithmicPatternModalOpen(false);
  };

  const selectAlgorithmicPattern = useCallback((selectedPattern) => {
    console.log(editRow);
    if (editRow !== null) {
      console.log(selectedPattern)
      console.log(dynamicRows)
      const updatedRows = [...dynamicRows];
      updatedRows[editRow].algorithmPattern = selectedPattern.algorithm.name;
      let behavioralPattern = selectedPattern.behavioral;
      
      updatedRows[editRow].behavioralPattern = behavioralPattern;
      let augmentationPattern = selectedPattern.augmentation;
      
      updatedRows[editRow].augmentationPattern = augmentationPattern;
      console.log(updatedRows);
      setDynamicRows(updatedRows);
      setEditRow(null);
    } else {
      console.log(selectedPattern)
      const newButtonLabel = selectedPattern.name;
      const algorithmPattern = selectedPattern.algorithm.name;
      const behavioralPattern = selectedPattern.behavioral;
      const augmentationPattern = selectedPattern.augmentation;
      const newRowData = { algorithmPattern: algorithmPattern, behavioralPattern: behavioralPattern, augmentationPattern: augmentationPattern };
      setDynamicRows([...dynamicRows, newRowData]);
      setButtonSelectedPatterns({ ...buttonSelectedPatterns, [newButtonLabel]: [] });
    }
    closeAlgorithmicPatternModal();
  }, [buttonSelectedPatterns, dynamicRows, editRow]);

  const switchView = (viewType, buttonLabel) => {
    setCurrentView(viewType);
    setSelectedButton(buttonLabel);
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

  const deleteRow = (index) => {
    const updatedRows = [...dynamicRows];
    updatedRows.splice(index, 1);
    setDynamicRows(updatedRows);
  };

  const openEditRow = (index) => {
    console.log(index);
    // Get the data of the row being edited
    const rowToEdit = dynamicRows[index];
    setEditRowData(rowToEdit);
    setEditRow(index);
    openAlgorithmicPatternModal();
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
            initialSelectedPattern={editRowData !== null ? editRowData : null}
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dynamicRows.map((row, index) => (
                  <tr key={index}>
                    <td>{row.algorithmPattern}</td>
                    <td>
                      {row.behavioralPattern.map((behavioralItem, index) => (
                        <img
                          key={index}
                          src={behavioralItem.iconUrl}
                          title={behavioralItem.name}
                          alt={`Behavioral Icon ${index}`}
                          style={{ width: '120px', height: 'auto' }}
                        />
                      ))}
                    </td>
                    <td>{row.augmentationPattern.map((augmentationItem, index) => (
                        <img
                          key={index}
                          src={augmentationItem.iconUrl}
                          title={augmentationItem.name}
                          alt={`Augmentation Icon ${index}`}
                          style={{ width: '120px', height: 'auto' }}
                        />
                      ))}</td>
                    <td>
                      <button onClick={() => moveRowUp(index)}>↑</button>
                    </td>
                    <td>
                      <button onClick={() => moveRowDown(index)}>↓</button>
                    </td>
                    <td>
                      <button onClick={() => openEditRow(index)}>Edit</button>
                      <button onClick={() => deleteRow(index)}>Delete</button>
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
        </div>
      </Footer>
    </Modal>
  );
}
