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
  PATTERN_MITIGATION,
  PATTERN_BEHAVIORAL_EXCLUSIVE,
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
  const [
    selectedBehavioralExclusivePattern,
    setSelectedBehavioralExclusivePattern,
  ] = useState(null);
  const [
    selectedBehavioralExclusivePatternRadioButton,
    setSelectedBehavioralExclusivePatternRadioButton,
  ] = useState(false);
  const [selectedAugmentationPatterns, setSelectedAugmentationPatterns] =
    useState([]);
  const [selectedMitigatedPattern, setSelectedMitigitationPatterns] =
    useState(null);
  const [
    selectedMitigatedCombinedPattern,
    setSelectedMitigitationCombinedPattern,
  ] = useState([]);
  const [
    selectedErrorMitigatedPatternRadioButton,
    setSelectedErrorMitigatedPatternRadioButton,
  ] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialSelectedPattern) {
      setSelectedAlgorithmPattern(initialSelectedPattern.algorithmPattern);
      const behavioralPattern = initialSelectedPattern.behavioralPattern.find(
        (element) => element.name !== "Prioritized Execution"
      );

      if (behavioralPattern) {
        setSelectedBehavioralExclusivePattern(behavioralPattern);
        setSelectedBehavioralExclusivePatternRadioButton(true);
      }
      const updatedBehavioralPatterns =
        initialSelectedPattern.behavioralPattern.filter(
          (element) => element.name === "Prioritized Execution"
        );

      setSelectedBehavioralPatterns(updatedBehavioralPatterns);
      console.log(initialSelectedPattern.augmentationPattern);
      const mitigationErrorPatterns =
        initialSelectedPattern.augmentationPattern.filter(
          (pattern) =>
            pattern.name === "Readout Error Mitigation" ||
            pattern.name === "Gate Error Mitigation" ||
            pattern.name === "Error Correction"
        );
      if (mitigationErrorPatterns.length > 1) {
        setSelectedMitigitationCombinedPattern(mitigationErrorPatterns);
        setSelectedErrorMitigatedPatternRadioButton(true);
      } else {
        setSelectedMitigitationPatterns(mitigationErrorPatterns[0]);
        setSelectedErrorMitigatedPatternRadioButton(true);
      }
      setSelectedAugmentationPatterns(
        initialSelectedPattern.augmentationPattern
      );

      const selectedMitigationIds = mitigationErrorPatterns.flatMap((pattern) =>
        pattern.id ? [pattern.id] : []
      );

      const selectedCombinedMitigationIds =
        selectedMitigatedCombinedPattern.flatMap((pattern) =>
          pattern.id ? [pattern.id] : []
        );

      const updatedAugmentationPatterns =
        initialSelectedPattern.augmentationPattern.filter(
          (pattern) =>
            !selectedMitigationIds.includes(pattern.id) &&
            !selectedCombinedMitigationIds.includes(pattern.id)
        );

      setSelectedAugmentationPatterns(updatedAugmentationPatterns);
    }
  }, [initialSelectedPattern]);

  const handleClick = (category) => {
    if (category === PATTERN_BEHAVIORAL_EXCLUSIVE) {
      if (selectedBehavioralExclusivePatternRadioButton) {
        setSelectedBehavioralExclusivePattern(null);
      }
      setSelectedBehavioralExclusivePatternRadioButton(
        !selectedBehavioralExclusivePatternRadioButton
      );
    } else if (category === PATTERN_MITIGATION) {
      if (selectedErrorMitigatedPatternRadioButton) {
        setSelectedMitigitationPatterns(null);
      }
      setSelectedErrorMitigatedPatternRadioButton(
        !selectedErrorMitigatedPatternRadioButton
      );
    } else if (category === "combined") {
      if (selectedErrorMitigatedPatternRadioButton) {
        setSelectedMitigitationCombinedPattern([]);
        setSelectedAugmentationPatterns([]);
      }
      setSelectedErrorMitigatedPatternRadioButton(
        !selectedErrorMitigatedPatternRadioButton
      );
    }
  };

  const handlePatternSelection = (pattern, category) => {
    if (category === PATTERN_ALGORITHM) {
      setSelectedAlgorithmPattern(pattern);
    } else if (category === PATTERN_BEHAVIORAL) {
      console.log(pattern);
      console.log(selectedBehavioralPatterns);
      setSelectedBehavioralPatterns((prevSelected) => {
        if (prevSelected.includes(pattern)) {
          return prevSelected.filter((selected) => selected !== pattern);
        } else {
          return [...prevSelected, pattern];
        }
      });
      console.log(selectedBehavioralPatterns);
    } else if (category === PATTERN_BEHAVIORAL_EXCLUSIVE) {
      setSelectedBehavioralExclusivePattern(pattern);
      setSelectedBehavioralExclusivePatternRadioButton(true);
    } else if (category === PATTERN_AUGMENTATION) {
      console.log("add augmentation");
      setSelectedAugmentationPatterns((prevSelected) => {
        if (prevSelected.includes(pattern)) {
          return prevSelected.filter((selected) => selected !== pattern);
        } else {
          return [...prevSelected, pattern];
        }
      });
    } else if (category === PATTERN_MITIGATION) {
      setSelectedMitigitationPatterns(pattern);
      handleMitigationCombinedSelection([]);
      setSelectedErrorMitigatedPatternRadioButton(true);
    }
  };

  const handleMitigationCombinedSelection = (patterns) => {
    console.log("add combined");
    console.log(selectedMitigatedCombinedPattern);
    console.log(patterns.length === 0);
    if (selectedMitigatedCombinedPattern.length > 0) {
      console.log("remove");
      setSelectedMitigitationCombinedPattern([]);
    } else if (patterns.length === 0) {
      console.log("empty");
      setSelectedMitigitationCombinedPattern([]);
    } else {
      console.log("add both");
      setSelectedMitigitationPatterns(null);
      setSelectedMitigitationCombinedPattern(patterns);
      setSelectedErrorMitigatedPatternRadioButton(true);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedAlgorithmPattern) {
      let combinedAugmentationPatterns = selectedAugmentationPatterns;
      if (selectedBehavioralExclusivePattern) {
        selectedBehavioralPatterns.push(selectedBehavioralExclusivePattern);
      }
      console.log(selectedAugmentationPatterns);
      if (
        selectedMitigatedPattern &&
        !selectedAugmentationPatterns.some(
          (pattern) => pattern.id === selectedMitigatedPattern.id
        )
      ) {
        console.log("push");
        selectedAugmentationPatterns.push(selectedMitigatedPattern);
      }
      console.log(selectedMitigatedCombinedPattern);
      if (selectedMitigatedCombinedPattern.length > 0) {
        console.log("concat");
        combinedAugmentationPatterns = selectedAugmentationPatterns.concat(
          selectedMitigatedCombinedPattern.filter(
            (pattern) =>
              !selectedAugmentationPatterns.some(
                (existingPattern) => existingPattern.id === pattern.id
              )
          )
        );
      }
      console.log(selectedAugmentationPatterns);
      const selectedPatterns = {
        algorithm: selectedAlgorithmPattern,
        behavioral: selectedBehavioralPatterns,
        augmentation: combinedAugmentationPatterns,
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
  const mitigationErrorPatterns = patterns.filter(
    (pattern) =>
      pattern.name === "Readout Error Mitigation" ||
      pattern.name === "Gate Error Mitigation" ||
      pattern.name === "Error Correction"
  );

  const mitigationPatterns = patterns.filter(
    (pattern) =>
      pattern.name === "Readout Error Mitigation" ||
      pattern.name === "Gate Error Mitigation"
  );
  const augmentationPatterns = patterns.filter(
    (pattern) =>
      pattern.tags &&
      pattern.tags.includes(PATTERN_AUGMENTATION) &&
      !mitigationErrorPatterns.some(
        (mitigationPattern) => mitigationPattern.id === pattern.id
      )
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
                    {pattern.name !== "Prioritized Execution" ? (
                      <input
                        id="behavioral-pattern"
                        name="behavioral-pattern"
                        type="radio"
                        checked={
                          (selectedBehavioralExclusivePattern === pattern ||
                            selectedBehavioralPatterns.includes(pattern)) &&
                          selectedBehavioralExclusivePatternRadioButton
                        }
                        onChange={() =>
                          handlePatternSelection(
                            pattern,
                            PATTERN_BEHAVIORAL_EXCLUSIVE
                          )
                        }
                        onClick={() =>
                          handleClick(PATTERN_BEHAVIORAL_EXCLUSIVE)
                        }
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={selectedBehavioralPatterns.includes(pattern)}
                        onChange={() =>
                          handlePatternSelection(pattern, PATTERN_BEHAVIORAL)
                        }
                      />
                    )}
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
          <h4>Mitigation & Error Correction Patterns</h4>
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
              {mitigationErrorPatterns.map((pattern) => (
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
                      name="mitigation"
                      checked={
                        selectedMitigatedPattern === pattern &&
                        selectedErrorMitigatedPatternRadioButton
                      }
                      onChange={() =>
                        handlePatternSelection(pattern, PATTERN_MITIGATION)
                      }
                      onClick={() => handleClick(PATTERN_MITIGATION)}
                    />
                  </td>
                </tr>
              ))}
              <tr key={"mitigationErrorPatterns"}>
                <td>
                  <a
                    className="pattern-links"
                    href={
                      patternAtlasUIEndpoint +
                      "/pattern-languages/" +
                      mitigationPatterns[0].patternLanguageId +
                      "/" +
                      mitigationPatterns[0].id
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Gate & Readout Error Mitigation
                  </a>
                </td>
                <td>
                  <img
                    src={mitigationPatterns[0].iconUrl}
                    alt={mitigationPatterns[0].name}
                    style={{ width: "30%", height: "auto" }}
                  />
                  <img
                    src={mitigationPatterns[1].iconUrl}
                    alt={mitigationPatterns[1].name}
                    style={{ width: "30%", height: "auto" }}
                  />
                </td>
                <td>
                  <input
                    type="radio"
                    name="mitigation"
                    checked={
                      selectedMitigatedCombinedPattern.includes(
                        mitigationPatterns[0]
                      ) &&
                      selectedMitigatedCombinedPattern.includes(
                        mitigationPatterns[1]
                      ) &&
                      selectedErrorMitigatedPatternRadioButton
                    }
                    onChange={() => {
                      handleMitigationCombinedSelection([
                        mitigationPatterns[0],
                        mitigationPatterns[1],
                      ]);
                    }}
                    onClick={() => handleClick("combined")}
                  />
                </td>
              </tr>
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
