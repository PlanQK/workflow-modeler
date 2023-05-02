import React, {useState} from 'react';
import TransformationButton from "./TransformationButton";
import {getXml, handleTransformedWorkflow} from '../../common/util/IoUtilities';
import NotificationHandler from './notifications/NotificationHandler';
import {getModeler} from '../ModelerHandler';

export default function ToolbarTransformationButton(props) {

  const {
    subButtons,
    title,
    styleClass,
  } = props;

  const [isToggleOn, setToggleOn] = useState(false);

  // initially activate all transformations
  const initialTransformationStates = {};
  subButtons.forEach(function (button) {
    initialTransformationStates[button.props.name] = true;
  });

  /*
  Saves whether a transformation should be executed, if the state of a transformation is true, this transformation will be executed
   */
  const [transformationStates, setTransformationStates] = useState(initialTransformationStates);

  async function startTransformation() {

    const modeler = getModeler();
    let xml = await getXml(modeler);
    let tmp;

    try {
      // start all active transformations
      for (let transformationButton of subButtons) {

        if (transformationStates[transformationButton.props.name]) {

          console.log('Starting Transformation for ' + transformationButton.props.name);
          tmp = await transformationButton.props.transformWorkflow(xml);

          if (tmp && tmp.status === 'transformed') {
            xml = tmp.xml;

          } else {

            const cause = tmp.cause || 'Transformation failed because of an unexpected error.';

            NotificationHandler.getInstance().displayNotification({
              type: 'warning',
              title: 'Unable to transform workflow',
              content: cause,
              duration: 10000
            });
          }
        }
      }
      if (xml) {
        await handleTransformedWorkflow(xml);
      }

    } catch (error) {
      NotificationHandler.getInstance().displayNotification({
        type: 'warning',
        title: 'Error during transformation',
        content: 'An unexpected error occurred during transformation. Please check the formatting of your workflow.',
        duration: 10000
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

  return (
    <div>
      <button className={isToggleOn ? 'extensible-btn' : 'toolbar-btn'} title="Transform current workflow into native BPMN">
        <div style={{display: 'flex',}}>
                    <span className={styleClass} onClick={() => startTransformation()}>
                        <span className="indent">{title}</span>
                    </span>
          <div className="toolbar-transformation-btn" onClick={() => setToggleOn(!isToggleOn)}>
                        <span className="toolbar-transformation-edit-icon">
                            <span className="indent"/>
                        </span>
          </div>
        </div>
      </button>

      {isToggleOn &&
        <div className="extensible-buttons-list">
          {
            subButtons.map(function (entry, index) {
              return (<TransformationButton
                key={index}
                transformWorkflow={entry.props.transformWorkflow}
                title={entry.props.title}
                name={entry.props.name}
                className={entry.props.className}
                selectedCallback={selectedCallback}
                isChecked={transformationStates[entry.props.name]}/>);
            })
          }
        </div>
      }
    </div>
  );
}