import React, { useRef, useState, useEffect } from "react";
import TransformationButton from "./TransformationButton";
import { getXml, handleTransformedWorkflow } from "../util/IoUtilities";
import NotificationHandler from "./notifications/NotificationHandler";
import { getModeler } from "../ModelerHandler";

/**
 * Component which groups the TransformationButtons defined by the plugins. Each button defines a transformation function which
 * can be activated via its checkbox. With a click on this component all active transformation functions will be executed
 * after each other.
 *
 * The grouped TransformationButtons can be displayed by a click on the wretch icon of this component.
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function TransformationToolbarButton(props) {
  const {
    subButtons, // list of transformation buttons
    title,
    styleClass,
  } = props;

  // flag defining if the subButtons should be displayed or not
  const [isToggleOn, setToggleOn] = useState(false);

  const wrapperRef = useRef(null);

  // initially activate all transformations
  const initialTransformationStates = {};
  subButtons.forEach(function (button) {
    initialTransformationStates[button.props.name] = true;
  });

  /*
    Saves whether a transformation should be executed, if the state of a transformation is true,
    this transformation will be executed
     */
  const [transformationStates, setTransformationStates] = useState(
    initialTransformationStates
  );

  // execute the transformation functions of each button
  async function startTransformation() {
    // get current workflow of the modeler as xml string
    const modeler = getModeler();
    let xml = await getXml(modeler);
    let tmp;

    // show notification if at least one transformation function is active
    if (Object.entries(transformationStates).some((state) => state[1])) {
      NotificationHandler.getInstance().displayNotification({
        type: "info",
        title: "Workflow Transformation Started!",
        content:
          "Successfully started transformation process for the current workflow!",
        duration: 7000,
      });
    }

    try {
      // start all active transformations
      for (let transformationButton of subButtons) {
        if (transformationStates[transformationButton.props.name]) {
          console.log(
            "Starting Transformation for " + transformationButton.props.name
          );

          // execute transformation function of the button
          tmp = await transformationButton.props.transformWorkflow(xml);

          if (tmp && tmp.status === "transformed") {
            xml = tmp.xml;
          } else {
            // break process if one transformation fails
            const cause =
              tmp.cause ||
              "Transformation failed because of an unexpected error.";

            NotificationHandler.getInstance().displayNotification({
              type: "warning",
              title: `Unable to transform ${transformationButton.props.name} elements in the workflow`,
              content: cause,
              duration: 10000,
            });
            return;
          }
        }
      }
      // handle transformed workflow (open in new tab, save to file storage etc.)
      await handleTransformedWorkflow(xml);
    } catch (error) {
      NotificationHandler.getInstance().displayNotification({
        type: "warning",
        title: "Error during transformation",
        content:
          "An unexpected error occurred during transformation. Please check the formatting of your workflow.",
        duration: 10000,
      });
      console.log(error);
    }
  }

  // callback to activate/ deactivate a transformation
  function selectedCallback(isActive, transformationName) {
    const newState = transformationStates;
    newState[transformationName] = isActive;
    setTransformationStates(newState);
  }

  // opens/ closes subButtons by inverting isToggleOn
  function handleClick() {
    if (!isToggleOn) {
      // dispatch event to close other extensible buttons
      const newEvent = new CustomEvent("new-extensible-button-opened", {
        detail: {
          openButtonId: title + styleClass,
        },
      });
      return document.dispatchEvent(newEvent);
    }

    setToggleOn(!isToggleOn);
  }

  // close displayed TransformationButtons if another ExtensibleButton is opening
  const openingListener = (event) => {
    const currentId = title + styleClass;
    setToggleOn(currentId === event.detail.openButtonId);
  };

  useEffect(() => {
    document.addEventListener("new-extensible-button-opened", openingListener);
    return () => {
      document.removeEventListener(
        "new-extensible-button-opened",
        openingListener
      );
    };
  }, []);

  return (
    <div ref={wrapperRef}>
      <button
        className={isToggleOn ? "qwm-extensible-btn" : "qwm-toolbar-btn"}
        title="Transform current workflow into native BPMN"
      >
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex" }}>
            <span className={styleClass} onClick={() => startTransformation()}>
              <span className="qwm-indent">{title}</span>
            </span>
          </div>
          <hr className="qwm-toolbar-splitter" />
          <div
            className="qwm-toolbar-transformation-btn"
            style={{ display: "flex" }}
            onClick={handleClick}
          >
            <span className="qwm-toolbar-transformation-edit-icon">
              <span className="qwm-indent" />
            </span>
          </div>
        </div>
      </button>

      {isToggleOn && (
        <div className="qwm-extensible-buttons-list">
          {subButtons.map(function (entry, index) {
            return (
              <TransformationButton
                key={index}
                transformWorkflow={entry.props.transformWorkflow}
                title={entry.props.title}
                name={entry.props.name}
                className={entry.props.className}
                selectedCallback={selectedCallback}
                isChecked={transformationStates[entry.props.name]}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}