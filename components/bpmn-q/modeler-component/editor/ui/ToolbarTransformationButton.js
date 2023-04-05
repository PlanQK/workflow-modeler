import React, {useState} from 'react';
import TransformationButton from "./TransformationButton";
import {getXml, saveXmlAsLocalFile} from '../../common/util/IoUtilities';
import NotificationHandler from './notifications/NotificationHandler';
import {getModeler} from '../ModelerHandler';

export default function ToolbarTransformationButton(props) {

  const {
    subButtons,
    title,
    styleClass,
  } = props;

  const newSubButtons = [];
  const initState = {};
  let newButton;

  // recreate transformation buttons to add the selectedCallback()
  for (let button of subButtons) {
    newButton = <TransformationButton transformWorkflow={button.props.transformWorkflow}
                                      title={button.props.title}
                                      name={button.props.name}
                                      className={button.props.className}
                                      selectedCallback={selectedCallback}/>;
    newSubButtons.push(newButton);

    initState[newButton.props.name] = true;
  }

  const [isToggleOn, setToggleOn] = useState(false);

  // saves whether a transformation should be executed
  const [transformationStates, setTransformationStates] = useState(initState);

  async function startTransformation() {

    const modeler = getModeler();
    let xml = await getXml(modeler);
    // let result;
    let tmp;

    try {
      // start all active transformations
      for (let transformationButton of subButtons) {

        if (transformationStates[transformationButton.props.name]) {

          console.log('Starting Transformation for ' + transformationButton.props.name);
          tmp = await transformationButton.props.transformWorkflow(xml);

          if (tmp && tmp.status === 'transformed') {
            xml = tmp.xml;
            // result = tmp;
            // await saveXmlAsLocalFile(result.xml, 'myProcess_transformed.bpmn');
            // await loadDiagram(result.xml, modeler);
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
        await saveXmlAsLocalFile(xml, 'myProcess_transformed.bpmn');
      }

    } catch (error) {
      NotificationHandler.getInstance().displayNotification({
        type: 'warning',
        title: 'Error during transformation',
        content: 'An unexpected error occured during transformation. Please check the formatting of your workflow.',
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
      <button className={isToggleOn ? 'extensible-btn' : 'toolbar-btn'}>
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
        {React.Children.toArray(newSubButtons)}
      </div>
      }
    </div>
  );
}