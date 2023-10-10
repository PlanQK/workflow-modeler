import React, { useState, useEffect } from "react";
import Modal from "../../../../editor/ui/modal/Modal";

const Title = Modal.Title || (({ children }) => <h4>{children}</h4>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function AdaptationModal({ onClose, responseData }) {

  const [currentView, setCurrentView] = useState("algorithmic");
  const [dynamicButtons, setDynamicButtons] = useState([
    { label: "Default Button", viewType: "default" },
    { label: "Algorithmic Patterns", viewType: "algorithmic" }
  ]);
  const [buttonSelectedPatterns, setButtonSelectedPatterns] = useState({});
  const [patternsToDisplay, setPatternsToDisplay] = useState([]);
  const [selectedButton, setSelectedButton] = useState(null); // Track the selected button

  const addDynamicButton = () => {
    const newButtonLabel = `Button ${dynamicButtons.length + 1}`;
    setDynamicButtons([...dynamicButtons, { label: newButtonLabel, viewType: "dynamic" }]);
    setButtonSelectedPatterns({ ...buttonSelectedPatterns, [newButtonLabel]: [] });
  };

  const removeDynamicButton = (index) => {
    const updatedButtons = [...dynamicButtons];
    updatedButtons.splice(index, 1);
    setDynamicButtons(updatedButtons);

    // Remove the selected patterns for the removed button
    const updatedSelectedPatterns = { ...buttonSelectedPatterns };
    delete updatedSelectedPatterns[dynamicButtons[index].label];
    setButtonSelectedPatterns(updatedSelectedPatterns);

    // Reset the selected button
    setSelectedButton(null);
  };

  const switchView = (viewType, buttonLabel) => {
    setCurrentView(viewType);
    // Set the selected button
    setSelectedButton(buttonLabel);
  };

  const togglePatternSelection = (pattern, buttonLabel) => {
    const isSelected = buttonSelectedPatterns[buttonLabel]?.includes(pattern) || false;
    const updatedSelectedPatterns = { ...buttonSelectedPatterns };

    if (isSelected) {
      updatedSelectedPatterns[buttonLabel] = (updatedSelectedPatterns[buttonLabel] || []).filter(
        (selectedPattern) => selectedPattern !== pattern
      );
    } else {
      updatedSelectedPatterns[buttonLabel] = [...(updatedSelectedPatterns[buttonLabel] || []), pattern];
    }

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
    if (currentView === "algorithmic") {
      setPatternsToDisplay(responseData);
    } else if (currentView === "behavior") {
      setPatternsToDisplay(responseData);
    } else if (currentView === "more") {
      setPatternsToDisplay(responseData);
    }
  }, [currentView, responseData]);

  return (
    <Modal onClose={onClose}>
      <Title>Pattern Selection</Title>

      <Body>
        <h3>Selected Algorithmic Patterns <button onClick={addDynamicButton}>+</button></h3>
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
                  onClick={() => switchView(button.viewType, button.label)}
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
            const buttonLabel = dynamicButtons[index]?.label || "";
            return (
              <div
                key={index}
                className={`pattern-card ${buttonSelectedPatterns[currentView]?.includes(pattern) ? "selected" : ""}`}
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
            Cancel
          </button>
        </div>
      </Footer>
    </Modal>
  );
}
