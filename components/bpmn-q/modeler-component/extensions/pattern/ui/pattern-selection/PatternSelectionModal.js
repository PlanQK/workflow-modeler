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
import {
  PATTERN_BEHAVIORAL,
  PATTERN_ALGORITHM,
  PATTERN_AUGMENTATION,
} from "../../Constants";
import { getModeler } from "../../../../editor/ModelerHandler";

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
    if (category === PATTERN_ALGORITHM) {
      setSelectedAlgorithmPattern(pattern);
    } else if (category === PATTERN_BEHAVIORAL) {
      setSelectedBehavioralPatterns((prevSelected) => {
        if (prevSelected.includes(pattern)) {
          return prevSelected.filter((selected) => selected !== pattern);
        } else {
          return [...prevSelected, pattern];
        }
      });
    } else if (category === PATTERN_AUGMENTATION) {
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

  const algorithmPatterns = patterns.filter(
    (pattern) => pattern.tags && pattern.tags.includes(PATTERN_ALGORITHM)
  );
  const behavioralPatterns = patterns.filter(
    (pattern) => pattern.tags && pattern.tags.includes(PATTERN_BEHAVIORAL)
  );
  const augmentationPatterns = patterns.filter(
    (pattern) => pattern.tags && pattern.tags.includes(PATTERN_AUGMENTATION)
  );

  const patternAtlasUIEndpoint = getModeler().config.patternAtlasUIEndpoint;
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
                  <td>
                    <a
                      className="pattern-links"
                      href={
                        patternAtlasUIEndpoint +
                        "/pattern-languages/" +
                        pattern.patternLanguageId +
                        "/" +
                        pattern.id
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {pattern.name}
                    </a>
                  </td>
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
                        handlePatternSelection(pattern, PATTERN_ALGORITHM)
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
                  <td>
                    <a
                      className="pattern-links"
                      href={
                        patternAtlasUIEndpoint +
                        "/pattern-languages/" +
                        pattern.patternLanguageId +
                        "/" +
                        pattern.id
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {pattern.name}
                    </a>
                  </td>
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
                        handlePatternSelection(pattern, PATTERN_BEHAVIORAL)
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
                  <td>
                    <a
                      className="pattern-links"
                      href={
                        patternAtlasUIEndpoint +
                        "/pattern-languages/" +
                        pattern.patternLanguageId +
                        "/" +
                        pattern.id
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {pattern.name}
                    </a>
                  </td>
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
                        handlePatternSelection(pattern, PATTERN_AUGMENTATION)
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
