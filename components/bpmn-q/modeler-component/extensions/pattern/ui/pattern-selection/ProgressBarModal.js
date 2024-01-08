import React, { useState, useEffect } from "react";
import Modal from "../../../../editor/ui/modal/Modal";
import {
  fetchDataFromEndpoint,
  fetchSolutionFromEndpoint,
} from "../../../../editor/util/HttpUtilities";
import { INITIAL_DIAGRAM_XML } from "../../../../editor/EditorConstants";
import { getModeler } from "../../../../editor/ModelerHandler";

const Title = Modal.Title || (({ children }) => <h4>{children}</h4>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

const ProgressBarModal = ({ responseData, selectedPatterns, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [currentIdIndex, setCurrentIdIndex] = useState(0);
  const [solutions, setSolutions] = useState([]);
  const qcAtlasEndpoint = getModeler().config.qcAtlasEndpoint;
  console.log(getModeler().config);

  useEffect(() => {
    const fetchData = async () => {
      console.log("extract now");
      console.log(selectedPatterns);
      const totalRequests = responseData.length;
      let successfulRequests = 0;
      const fetchedSolutions = [];
      let foundSolution = false;
      for (let j = 0; j < selectedPatterns.length; j++) {
        // get the selected algorithm id
        let algorithmPatternId = selectedPatterns[j].algorithmPattern.id;

        for (let i = 0; i < totalRequests; i++) {
          console.log(responseData[i]);
          const { id, implementedAlgorithmId, patterns } = responseData[i];
          console.log(patterns);
          if (patterns !== undefined && patterns.length > 0) {
            const linkedPattern = patterns[0].split("/");

            const linkedAlgorithmPatternId =
              linkedPattern[linkedPattern.length - 1];
            console.log(linkedAlgorithmPatternId);
            console.log(algorithmPatternId);
            if (algorithmPatternId === linkedAlgorithmPatternId) {
              try {
                if (implementedAlgorithmId !== undefined) {
                  console.log(
                    `Retrieving solution for algorithm ${implementedAlgorithmId} and implementation ${id}`
                  );
                  setCurrentIdIndex(i);

                  console.log(
                    `${qcAtlasEndpoint}/atlas/algorithms/${implementedAlgorithmId}/implementations/${id}/implementation-packages`
                  );
                  const response = await fetchDataFromEndpoint(
                    `${qcAtlasEndpoint}/atlas/algorithms/${implementedAlgorithmId}/implementations/${id}/implementation-packages`
                  );

                  console.log(response);

                  if (response && response.content.length > 0) {
                    // currently takes the first solution
                    let solutionId = response.content[0].id;
                    console.log(
                      `${qcAtlasEndpoint}/atlas/algorithms/${implementedAlgorithmId}/implementations/${id}/implementation-packages/${solutionId}/file/content`
                    );
                    const solutionPackage = await fetchSolutionFromEndpoint(
                      `${qcAtlasEndpoint}/atlas/algorithms/${implementedAlgorithmId}/implementations/${id}/implementation-packages/${solutionId}/file/content`
                    );
                    console.log(solutionPackage);

                    fetchedSolutions.push(solutionPackage);
                    foundSolution = true;
                    if (solutionPackage.ok) {
                      successfulRequests++;
                      fetchedSolutions.push(solutionPackage.content);
                    }

                    const newProgress =
                      (successfulRequests / totalRequests) * 100;
                    // Ensure the progress bar is at least 95% filled
                    const displayProgress = Math.min(newProgress, 95);

                    // Update the progress bar only if the component is still mounted
                    setProgress(displayProgress);
                  }
                }
              } catch (error) {
                console.error("Error fetching data:", error);
              }
            }
          }
        }
        if (!foundSolution) {
          // if no solution exists then an empty subprocess needs to be created
          fetchedSolutions.push(INITIAL_DIAGRAM_XML);
        }
        foundSolution = false;
      }
      setSolutions(fetchedSolutions);
      console.log("hier");
      setProgress(100);
    };

    fetchData();
  }, [responseData]);

  // Render the component with the updated progress value
  return (
    <Modal onClose={onClose}>
      <Title>Retrieve solutions</Title>

      <Body>
        <div className="spaceUnder">
          <p>
            Retrieving solution for algorithm{" "}
            {responseData.length > 0 &&
              responseData[currentIdIndex]?.implementedAlgorithmId}{" "}
            and implementation{" "}
            {responseData.length > 0 && responseData[currentIdIndex]?.id}
          </p>
        </div>
        <div
          className={`progress-bar${progress === 100 ? " stop-animation" : ""}`}
          style={{ width: `${progress}%` }}
        ></div>
      </Body>

      <Footer>
        <div id="hybridLoopAdaptationFormButtons">
          {/* Add any additional buttons or controls you need */}
          <button
            type="button"
            className="qwm-btn qwm-btn-primary"
            onClick={() => onClose(solutions)}
          >
            Select Patterns
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
    </Modal>
  );
};

export default ProgressBarModal;
