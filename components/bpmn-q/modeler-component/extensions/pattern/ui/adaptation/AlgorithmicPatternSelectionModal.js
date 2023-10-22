import React, { useState } from "react";
import Modal from "../../../../editor/ui/modal/Modal";

const Title = Modal.Title || (({ children }) => <h4>{children}</h4>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function AlgorithmicPatternSelectionModal({ patterns, onSelectPattern, onClose }) {
  const [selectedAlgorithmicPattern, setSelectedAlgorithmicPattern] = useState(null);
  const [selectedBehavioralPattern, setSelectedBehavioralPattern] = useState(null);
  const [selectedAugmentationPattern, setSelectedAugmentationPattern] = useState(null);

  const handlePatternSelection = (pattern, category) => {
    // Check which category is being selected and update the corresponding state
    if (category === "algorithm") {
      setSelectedAlgorithmicPattern(pattern);
    } else if (category === "behavioral") {
      setSelectedBehavioralPattern(pattern);
    } else if (category === "augmentation") {
      setSelectedAugmentationPattern(pattern);
    }
  };

  const handleConfirmSelection = () => {
    const selectedPatterns = [];
    if (selectedAlgorithmicPattern) {
      selectedPatterns.push(selectedAlgorithmicPattern);
    }
    if (selectedBehavioralPattern) {
      selectedPatterns.push(selectedBehavioralPattern);
    }
    if (selectedAugmentationPattern) {
      selectedPatterns.push(selectedAugmentationPattern);
    }

    onSelectPattern(selectedPatterns); // Pass the selected patterns to the parent component
    onClose();
  };

  // Filter patterns with specific tags for each category
  const algorithmicPatterns = patterns.filter((pattern) => pattern.tags.includes("algorithm"));
  const behavioralPatterns = patterns.filter((pattern) => pattern.tags.includes("behavioral"));
  const augmentationPatterns = patterns.filter((pattern) => pattern.tags.includes("augmentation"));

  return (
    <Modal onClose={onClose}>
      <Title>Algorithmic Patterns</Title>
      <Body>
        <div>
          <h5>Algorithmic Patterns</h5>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Icon</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {algorithmicPatterns.map((pattern) => (
                <tr key={pattern.id} onClick={() => handlePatternSelection(pattern, "algorithm")}>
                  <td>{pattern.name}</td>
                  <td>
                    <img src={pattern.iconUrl} alt={pattern.name} style={{ width: "15%", height: "auto" }} />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedAlgorithmicPattern === pattern}
                      onChange={() => handlePatternSelection(pattern, "algorithm")}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h5>Behavioral Patterns</h5>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Icon</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {behavioralPatterns.map((pattern) => (
                <tr key={pattern.id} onClick={() => handlePatternSelection(pattern, "behavioral")}>
                  <td>{pattern.name}</td>
                  <td>
                    <img src={pattern.iconUrl} alt={pattern.name} style={{ width: "15%", height: "auto" }} />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedBehavioralPattern === pattern}
                      onChange={() => handlePatternSelection(pattern, "behavioral")}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h5>Augmentation Patterns</h5>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Icon</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {augmentationPatterns.map((pattern) => (
                <tr key={pattern.id} onClick={() => handlePatternSelection(pattern, "augmentation")}>
                  <td>{pattern.name}</td>
                  <td>
                    <img src={pattern.iconUrl} alt={pattern.name} style={{ width: "15%", height: "auto" }} />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedAugmentationPattern === pattern}
                      onChange={() => handlePatternSelection(pattern, "augmentation")}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Footer>
          <button onClick={handleConfirmSelection}>Confirm Selection</button>
        </Footer>
      </Body>
    </Modal>
  );
}
