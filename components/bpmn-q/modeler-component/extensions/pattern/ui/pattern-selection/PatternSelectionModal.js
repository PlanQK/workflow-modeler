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

import React, { useState, useEffect } from "react";
import Modal from "../../../../editor/ui/modal/Modal";

const Title = Modal.Title || (({ children }) => <h4>{children}</h4>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function PatternSelectionModal({
  patterns,
  onSelectPattern,
  onClose,
  initialSelectedPattern,
}) {
  const [selectedAlgorithmPattern, setSelectedAlgorithmPattern] =
    useState(null);
  const [selectedBehavioralPatterns, setSelectedBehavioralPatterns] = useState(
    []
  );
  const [selectedAugmentationPatterns, setSelectedAugmentationPatterns] =
    useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialSelectedPattern) {
      setSelectedAlgorithmPattern(initialSelectedPattern.algorithmPattern);
      setSelectedBehavioralPatterns(initialSelectedPattern.behavioralPattern);
      setSelectedAugmentationPatterns(
        initialSelectedPattern.augmentationPattern
      );
    }
  }, [initialSelectedPattern]);

  const handlePatternSelection = (pattern, category) => {
    if (category === "algorithm") {
      setSelectedAlgorithmPattern(pattern);
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
    if (selectedAlgorithmPattern) {
      const selectedPatterns = {
        algorithm: selectedAlgorithmPattern,
        behavioral: selectedBehavioralPatterns,
        augmentation: selectedAugmentationPatterns,
      };
      onSelectPattern(selectedPatterns);
      onClose();
      clearErrorMessage();
    } else {
      setErrorMessage("Please select an algorithm pattern before confirming.");
    }
  };

  const clearErrorMessage = () => {
    setErrorMessage("");
  };

  const algorithmPatterns = patterns.filter((pattern) =>
    pattern.tags.includes("algorithm")
  );
  const behavioralPatterns = patterns.filter((pattern) =>
    pattern.tags.includes("behavioral")
  );
  const augmentationPatterns = patterns.filter((pattern) =>
    pattern.tags.includes("augmentation")
  );

  return (
    <Modal onClose={onClose}>
      <Title>Patterns</Title>
      <Body>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div>
          <h3>Algorithm Patterns</h3>
          <table>
            <colgroup>
              <col span="1" style={{ width: "30%" }} />
              <col span="1" style={{ width: "15%" }} />
              <col span="1" style={{ width: "7%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Name</th>
                <th>Icon</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {algorithmPatterns.map((pattern) => (
                <tr key={pattern.id}>
                  <td>{pattern.name}</td>
                  <td>
                    <img
                      src={pattern.iconUrl}
                      alt={pattern.name}
                      style={{ width: "30%", height: "auto" }}
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      name="algorithm-pattern"
                      checked={selectedAlgorithmPattern === pattern}
                      onChange={() =>
                        handlePatternSelection(pattern, "algorithm")
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Behavioral Patterns</h3>
          <table>
            <colgroup>
              <col span="1" style={{ width: "30%" }} />
              <col span="1" style={{ width: "15%" }} />
              <col span="1" style={{ width: "7%" }} />
            </colgroup>
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
                    <img
                      src={pattern.iconUrl}
                      alt={pattern.name}
                      style={{ width: "30%", height: "auto" }}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedBehavioralPatterns.includes(pattern)}
                      onChange={() =>
                        handlePatternSelection(pattern, "behavioral")
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Augmentation Patterns</h3>
          <table>
            <colgroup>
              <col span="1" style={{ width: "30%" }} />
              <col span="1" style={{ width: "15%" }} />
              <col span="1" style={{ width: "7%" }} />
            </colgroup>
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
                    <img
                      src={pattern.iconUrl}
                      alt={pattern.name}
                      style={{ width: "30%", height: "auto" }}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedAugmentationPatterns.includes(pattern)}
                      onChange={() =>
                        handlePatternSelection(pattern, "augmentation")
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Footer>
          <div id="configFormButtons">
            <button
              className="qwm-btn qwm-btn-primary"
              onClick={handleConfirmSelection}
            >
              Confirm Selection
            </button>

            <button
              type="button"
              className="qwm-btn qwm-btn-secondary"
              onClick={() => onClose()}
            >
              Cancel
            </button>
          </div>
        </Footer>
      </Body>
    </Modal>
  );
}
