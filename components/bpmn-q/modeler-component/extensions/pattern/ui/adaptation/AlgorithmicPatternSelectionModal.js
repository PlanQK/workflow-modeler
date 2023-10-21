import React from "react";
import Modal from "../../../../editor/ui/modal/Modal";

const Title = Modal.Title || (({ children }) => <h4>{children}</h4>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function AlgorithmicPatternSelectionModal({ patterns, onSelectPattern, onClose }) {
  const handlePatternSelection = (pattern) => {
    onSelectPattern(pattern); // Pass the selected pattern to the parent component
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <Title>Algorithmic Patterns</Title>
      <Body>
        <ul>
          {patterns.map((pattern) => (
            <li key={pattern.id} onClick={() => handlePatternSelection(pattern)}>
              <h4>{pattern.name}</h4>
              <img src={pattern.iconUrl} alt={pattern.name} style={{ width: "15%", height: "auto" }} />
            </li>
          ))}
        </ul>
      </Body>
    </Modal>
  );
}