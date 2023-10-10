import React, { useState, useEffect } from "react";
import Modal from "../../../../editor/ui/modal/Modal";

const Title = Modal.Title || (({ children }) => <h4>{children}</h4>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function AdaptationModal({ onClose, responseData }) {
  console.log(responseData);

  const [currentView, setCurrentView] = useState("algorithmic");
  const [dynamicButtons, setDynamicButtons] = useState([{ label: "Default Button", viewType: "default" }]);
  const [buttonSelectedPatterns, setButtonSelectedPatterns] = useState({}); // State to store selected patterns for each button
  const [patternsToDisplay, setPatternsToDisplay] = useState([]); // State to store the patterns to display for all buttons

  const addDynamicButton = () => {
    const newButtonLabel = `Button ${dynamicButtons.length + 1}`;
    setDynamicButtons([...dynamicButtons, { label: newButtonLabel, viewType: "dynamic" }]);
    setButtonSelectedPatterns({ ...buttonSelectedPatterns, [newButtonLabel]: [] }); // Initialize selected patterns for the new button
  };

  const switchView = (viewType) => {
    setCurrentView(viewType);
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

  useEffect(() => {
    // Determine which patterns to display based on the current view
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
        <div className="pattern-type-buttons">
          <button onClick={() => switchView("algorithmic")}>Algorithmic Patterns</button>
          <button onClick={() => switchView("behavior")}>Behavior Patterns</button>
          <button onClick={() => switchView("more")}>Augmentation Patterns</button>
          {dynamicButtons.map((button, index) => (
            <button key={index} onClick={() => switchView(button.viewType)}>
              {button.label}
            </button>
          ))}
          <button onClick={addDynamicButton}>+</button>
        </div>
        <div className="image-container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
          {patternsToDisplay.map((pattern, index) => {
            const buttonLabel = dynamicButtons[index]?.label || ''; // Retrieve button label or use an empty string as a default
            return (
              <div
                key={index}
                className={`pattern-card ${buttonSelectedPatterns[buttonLabel]?.includes(pattern) ? "selected" : ""}`}
                onClick={() => togglePatternSelection(pattern, buttonLabel)}
              >
                <h4>{pattern.name}</h4>
                <img src={pattern.iconUrl} alt={pattern.name} style={{ width: "25%", height: "auto" }} className="centered-image" />
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
