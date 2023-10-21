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
  const [patternsToDisplay, setPatternsToDisplay] = useState([]);
  const [selectedButton, setSelectedButton] = useState(null);
  const [dynamicButtons, setDynamicButtons] = useState([
    { label: "Default Button", viewType: "default" },
    { label: "Algorithmic Patterns", viewType: "algorithmic" }
  ]);

  const [isAlgorithmicPatternModalOpen, setAlgorithmicPatternModalOpen] = useState(false);

  const openAlgorithmicPatternModal = () => {
    setAlgorithmicPatternModalOpen(true);
  };

  const closeAlgorithmicPatternModal = () => {
    setAlgorithmicPatternModalOpen(false);
  };

  const selectAlgorithmicPattern = useCallback((selectedPattern) => {
    const newButtonLabel = selectedPattern.name;
    const newDynamicButton = { label: newButtonLabel, viewType: "dynamic" };

    setDynamicButtons([...dynamicButtons, newDynamicButton]);
    setButtonSelectedPatterns({ ...buttonSelectedPatterns, [newButtonLabel]: [] });
    switchView("algorithmic", "dynamic");

    closeAlgorithmicPatternModal();
  }, [dynamicButtons, buttonSelectedPatterns]);

  const removeDynamicButton = (index) => {
    const updatedButtons = [...dynamicButtons];
    updatedButtons.splice(index, 1);
    setDynamicButtons(updatedButtons);
    const updatedSelectedPatterns = { ...buttonSelectedPatterns };
    delete updatedSelectedPatterns[dynamicButtons[index].label];
    setButtonSelectedPatterns(updatedSelectedPatterns);
    setSelectedButton(null);
  };

  const switchView = (viewType, buttonLabel) => {
    setCurrentView(viewType);
    setSelectedButton(buttonLabel);
  };

  const togglePatternSelection = (pattern, view) => {
    console.log(selectedButton)
    
    const isSelected = buttonSelectedPatterns[selectedButton]?.includes(pattern) || false;
    const updatedSelectedPatterns = { ...buttonSelectedPatterns };

    if (isSelected) {
      updatedSelectedPatterns[selectedButton] = (updatedSelectedPatterns[selectedButton] || []).filter(
        (selectedPattern) => selectedPattern !== pattern
      );
    } else {
      updatedSelectedPatterns[selectedButton] = [...(updatedSelectedPatterns[selectedButton] || []), pattern];
      console.log(updatedSelectedPatterns)
    }
    console.log(updatedSelectedPatterns)
    setButtonSelectedPatterns(updatedSelectedPatterns);
  };

  const handleButtonDrag = (dragIndex, hoverIndex) => {
    const draggedButton = dynamicButtons[dragIndex];
    const updatedButtons = [...dynamicButtons];
    updatedButtons.splice(dragIndex, 1);
    updatedButtons.splice(hoverIndex, 0, draggedButton);
    setDynamicButtons(updatedButtons);
  };

  useEffect(() => {
    console.log(responseData)
    if(responseData != undefined) {
    if (currentView === "algorithmic") {
      const filteredPatterns = responseData.filter(pattern => pattern.tags.includes('algorithm'));
      setPatternsToDisplay(filteredPatterns);
    } else if (currentView === "behavioral") {
      const filteredPatterns = responseData.filter(pattern => pattern.tags.includes('behavioral'));
      const filteredAPatterns = responseData.filter(pattern => pattern.tags.includes('augmentation'));
      setPatternsToDisplay(filteredPatterns.concat(filteredAPatterns));
    } else if (currentView === "augmentation") {
      const filteredPatterns = responseData.filter(pattern => pattern.tags.includes('augmentation'));
      setPatternsToDisplay(filteredPatterns);
    }
  }else {
    NotificationHandler.getInstance().displayNotification({
      type: "info",
      title: "Pattern Selection Unsuccessful!",
      content: "The specified pattern atlas endpoint is not available.",
      duration: 7000,
    }) 
    onClose();
  }}, [currentView, responseData]);

  return (
    <Modal onClose={onClose}>
      <Title>Pattern Selection</Title>

      <Body>
        <h3>Selected Algorithmic Patterns <button onClick={openAlgorithmicPatternModal}>+</button></h3>
        {isAlgorithmicPatternModalOpen && (
          <AlgorithmicPatternSelectionModal
            patterns={patternsToDisplay}
            onSelectPattern={selectAlgorithmicPattern}
            onClose={closeAlgorithmicPatternModal}
          />
        )}
        <div className="pattern-type-buttons">
          <div className="dynamic-buttons-container">
            {dynamicButtons.map((button, index) => (
              <div
                key={index}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData("index", index);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const dragIndex = e.dataTransfer.getData("index");
                  const hoverIndex = index;
                  handleButtonDrag(dragIndex, hoverIndex);
                }}
              >
                <button
                  onClick={() => switchView("behavioral", button.label)}
                  className={selectedButton === button.label ? "selected-button" : ""}
                >
                  {button.label}
                </button>
                {button.viewType === "dynamic" && (
                  <button onClick={() => removeDynamicButton(index)}>Remove</button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="image-container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
          {patternsToDisplay.map((pattern, index) => {
            console.log(dynamicButtons)
            console.log(index)
            const buttonLabel = dynamicButtons[index]?.label || "";
            return (
              <div
                key={index}
                className={`pattern-card ${buttonSelectedPatterns[selectedButton]?.includes(pattern) ? "selected" : ""}`}
                onClick={() => togglePatternSelection(pattern, currentView)}
              >
                <h4>{pattern.name}</h4>
                <img src={pattern.iconUrl} alt={pattern.name} style={{ width: "15%", height: "auto" }} className="centered-image" />
              </div>
            );
          })}
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
