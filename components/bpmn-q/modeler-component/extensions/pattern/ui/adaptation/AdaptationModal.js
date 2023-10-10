import React, { useState } from "react";
import Modal from "../../../../editor/ui/modal/Modal";

// polyfill upcoming structural components
const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

/**
 * React component which contains a modal to analyze the current workflow for hybrid loops
 * and improve it if necessary.
 *
 * @param onClose Callback called when the modal is closed
 * @param responseData Data received from the API
 * @return {JSX.Element}
 * @constructor
 */
export default function AdaptationModal({ onClose, responseData }) {
  console.log(responseData);

  const [currentView, setCurrentView] = useState("algorithmic"); // Initially, display Algorithmic Patterns

  // Separate patterns based on their types
  const algorithmicPatterns = responseData;
  const behaviorPatterns = responseData.filter((pattern) => pattern.type === "behavior");
  const morePatterns = responseData.filter((pattern) => pattern.type === "more");

  return (
    <Modal onClose={onClose}>
      <Title>Pattern Selection</Title>

      <Body>
        {/* Buttons/Tabs to switch between views */}
        <div className="pattern-type-buttons">
          <button onClick={() => setCurrentView("algorithmic")}>Algorithmic Patterns</button>
          <button onClick={() => setCurrentView("behavior")}>Behavior Patterns</button>
          <button onClick={() => setCurrentView("more")}>More Patterns</button>
        </div>

        {/* Render the selected view */}
        {currentView === "algorithmic" && algorithmicPatterns.length > 0 && (
          <div>
            <h3>Algorithmic Patterns</h3>
            {algorithmicPatterns.map((pattern, index) => (
              <div key={index}>
                <h4>{pattern.name}</h4>
                <img src={pattern.iconUrl} alt={pattern.name} style={{ width: "25%", height: "auto" }} />
                {/* Add more content specific to algorithmic patterns */}
              </div>
            ))}
          </div>
        )}

        {currentView === "behavior" && behaviorPatterns.length > 0 && (
          <div>
            <h3>Behavior Patterns</h3>
            {behaviorPatterns.map((pattern, index) => (
              <div key={index}>
                <h2>{pattern.name}</h2>
                <img src={pattern.iconUrl} alt={pattern.name} />
                {/* Add more content specific to behavior patterns */}
              </div>
            ))}
          </div>
        )}

        {currentView === "more" && morePatterns.length > 0 && (
          <div>
            <h3>More Patterns</h3>
            {morePatterns.map((pattern, index) => (
              <div key={index}>
                <h2>{pattern.name}</h2>
                <img src={pattern.iconUrl} alt={pattern.name} />
                {/* Add more content specific to more patterns */}
              </div>
            ))}
          </div>
        )}
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
