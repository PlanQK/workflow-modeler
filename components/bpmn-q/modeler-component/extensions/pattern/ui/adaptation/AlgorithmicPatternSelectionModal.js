import React, { useState, useEffect } from "react";
import Modal from "../../../../editor/ui/modal/Modal";

const Title = Modal.Title || (({ children }) => <h4>{children}</h4>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function AlgorithmicPatternSelectionModal({ patterns, onSelectPattern, onClose, initialSelectedPattern }) {
  const [selectedAlgorithmicPattern, setSelectedAlgorithmicPattern] = useState(null);
  const [selectedBehavioralPatterns, setSelectedBehavioralPatterns] = useState([]);
  const [selectedAugmentationPatterns, setSelectedAugmentationPatterns] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialSelectedPattern) {
      console.log(initialSelectedPattern)
      const algorithmicPatterns = patterns.filter((pattern) => pattern.name === initialSelectedPattern.algorithmPattern);
      setSelectedAlgorithmicPattern(algorithmicPatterns[0]);
      setSelectedBehavioralPatterns(initialSelectedPattern.behavioralPattern);
      setSelectedAugmentationPatterns(initialSelectedPattern.augmentationPattern);
    }
  }, [initialSelectedPattern]);

  const handlePatternSelection = (pattern, category) => {
    if (category === "algorithm") {
      setSelectedAlgorithmicPattern(pattern);
    } else if (category === "behavioral") {
      setSelectedBehavioralPatterns((prevSelected) => {
        if (prevSelected.includes(pattern)) {
          return prevSelected.filter((selected) => selected !== pattern);
        } else {
          return [...prevSelected, pattern];
        }
      });
    } else if (category === "augmentation") {
      setSelectedAugmentationPatterns((prevSelected) => {
        if (prevSelected.includes(pattern)) {
          return prevSelected.filter((selected) => selected !== pattern);
        } else {
          return [...prevSelected, pattern];
        }
      });
    }
  };

  const handleConfirmSelection = () => {
    if (selectedAlgorithmicPattern) {
      const selectedPatterns = {
        algorithm: selectedAlgorithmicPattern,
        behavioral: selectedBehavioralPatterns,
        augmentation: selectedAugmentationPatterns,
      };
      onSelectPattern(selectedPatterns);
      onClose(); // Close the modal only if an algorithmic pattern is selected
      clearErrorMessage();
    } else {
      // Set an error message if no algorithmic pattern is selected
      setErrorMessage("Please select an algorithm pattern before confirming.");
    }
  };

  const clearErrorMessage = () => {
    setErrorMessage(""); // Clear the error message
  };
  // Filter patterns with specific tags for each category
  const algorithmicPatterns = patterns.filter((pattern) => pattern.tags.includes("algorithm"));
  const behavioralPatterns = patterns.filter((pattern) => pattern.tags.includes("behavioral"));
  const augmentationPatterns = patterns.filter((pattern) => pattern.tags.includes("augmentation"));

  return (
    <Modal onClose={onClose}>
      <Title>Algorithmic Patterns</Title>
      <Body>
      {errorMessage && (
  <p className="error-message">{errorMessage}</p>)}

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
                <tr key={pattern.id}>
                  <td>{pattern.name}</td>
                  <td>
                    <img src={pattern.iconUrl} alt={pattern.name} style={{ width: "15%", height: "auto" }} />
                  </td>
                  <td>
                    <input
                      type="radio"
                      name="algorithmic-pattern"
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
                <tr key={pattern.id}>
                  <td>{pattern.name}</td>
                  <td>
                    <img src={pattern.iconUrl} alt={pattern.name} style={{ width: "15%", height: "auto" }} />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedBehavioralPatterns.includes(pattern)}
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
                <tr key={pattern.id}>
                  <td>{pattern.name}</td>
                  <td>
                    <img src={pattern.iconUrl} alt={pattern.name} style={{ width: "15%", height: "auto" }} />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedAugmentationPatterns.includes(pattern)}
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
