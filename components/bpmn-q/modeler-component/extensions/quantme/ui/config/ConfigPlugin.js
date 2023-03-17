/**
 * Copyright (c) 2021 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable no-unused-vars*/
import React, { PureComponent, Fragment } from 'react';
// import React, { Fragment, PureComponent } from 'camunda-modeler-plugin-helpers/react';
// import { Fill } from 'camunda-modeler-plugin-helpers/components';

import ConfigModal from './ConfigModal';
import {getModeler} from "../../../../editor/ModelerHandler";
import config from "../../framework-config/config";
import configManager, {
  setAWSRuntimeHandlerEndpoint,
  setCamundaEndpoint, setHybridRuntimeProvenance,
  setNisqAnalyzerEndpoint,
  setOpenTOSCAEndpoint,
  setQiskitRuntimeHandlerEndpoint, setQRMRepositoryName, setQRMRepositoryPath, setQRMUserName,
  setScriptSplitterEndpoint,
  setScriptSplitterThreshold,
  setTransformationFrameworkEndpoint,
  setWineryEndpoint
} from "../../framework-config/config-manager"

const defaultState = {
  configOpen: false
};

export default class ConfigPlugin extends PureComponent {

  constructor(props) {
    super(props);

    // modelers for all tabs to enable switching between them
    this.modelers = {};

    this.state = defaultState;

    this.handleConfigClosed = this.handleConfigClosed.bind(this);

    // get config to update details in the backend
    this.backendConfig = '';//props._getGlobal('config');
  }

  componentDidMount() {

    this.modeler = getModeler();
    const self = this;

    const editorActions = this.modeler.get('editorActions');
    const eventBus = this.modeler.get('eventBus');

    // init modeler config
    if (!this.modeler.config) {
      this.modeler.config = config;
    }

    // initialize config in the frontend
    // this.backendConfig.getConfigFromBackend().then(config => {
    //   this.modeler.config = config;
    //   eventBus.fire('config.updated', config);
    // });

    editorActions.register({
      camundaEndpointChanged: function(camundaEndpoint) {
        self.modeler.config.camundaEndpoint = camundaEndpoint;
      }
    });
    editorActions.register({
      nisqAnalyzerEndpointChanged: function(nisqAnalyzerEndpoint) {
        self.modeler.config.nisqAnalyzerEndpoint = nisqAnalyzerEndpoint;
      }
    });
    editorActions.register({
      opentoscaEndpointChanged: function(opentoscaEndpoint) {
        self.modeler.config.opentoscaEndpoint = opentoscaEndpoint;
      }
    });
    editorActions.register({
      qrmRepoNameChanged: function(qrmRepoName) {
        self.modeler.config.githubRepositoryName = qrmRepoName;
      }
    });
    editorActions.register({
      qrmUserNameChanged: function(qrmUserName) {
        self.modeler.config.githubUsername = qrmUserName;
      }
    });
    editorActions.register({
      qrmRepoPathChanged: function(qrmRepoPath) {
        self.modeler.config.githubRepositoryPath = qrmRepoPath;
      }
    });
    editorActions.register({
      transformationFrameworkEndpointChanged: function(transformationFrameworkEndpoint) {
        self.modeler.config.transformationFrameworkEndpoint = transformationFrameworkEndpoint;
      }
    });
    editorActions.register({
      wineryEndpointChanged: function(wineryEndpoint) {
        self.modeler.config.wineryEndpoint = wineryEndpoint;
        eventBus.fire('config.updated', self.modeler.config);
      }
    });
    editorActions.register({
      qiskitRuntimeHandlerEndpointChanged: function(qiskitRuntimeHandlerEndpoint) {
        self.modeler.config.qiskitRuntimeHandlerEndpoint = qiskitRuntimeHandlerEndpoint;
        eventBus.fire('config.updated', self.modeler.config);
      }
    });
    editorActions.register({
      awsRuntimeHandlerEndpointChanged: function(awsRuntimeHandlerEndpoint) {
        self.modeler.config.awsRuntimeHandlerEndpoint = awsRuntimeHandlerEndpoint;
        eventBus.fire('config.updated', self.modeler.config);
      }
    });
    editorActions.register({
      hybridRuntimeProvenanceChanged: function(hybridRuntimeProvenance) {
        self.modeler.config.hybridRuntimeProvenance = hybridRuntimeProvenance;
        eventBus.fire('config.updated', self.modeler.config);
      }
    });
    editorActions.register({
      scriptSplitterEndpointChanged: function(scriptSplitterEndpoint) {
        self.modeler.config.scriptSplitterEndpoint = scriptSplitterEndpoint;
        eventBus.fire('config.updated', self.modeler.config);
      }
    });
    editorActions.register({
      scriptSplitterThresholdChanged: function(scriptSplitterEndpoint) {
        self.modeler.config.scriptSplitterThreshold = scriptSplitterEndpoint;
      }
    });

    // subscribe to updates for all configuration parameters in the backend
    // this.props.subscribe('bpmn.modeler.created', (event) => {
    //
    //   const {
    //     modeler, tab
    //   } = event;
    //
    //   // save modeler and activate as current modeler
    //   this.modelers[tab.id] = modeler;
    //   this.modeler = modeler;
    //   const self = this;
    //
    //   const editorActions = this.modeler.get('editorActions');
    //   const eventBus = this.modeler.get('eventBus');
    //
    //   // initialize config in the frontend
    //   this.backendConfig.getConfigFromBackend().then(config => {
    //     this.modeler.config = config;
    //     eventBus.fire('config.updated', config);
    //   });
    //
    //   editorActions.register({
    //     camundaEndpointChanged: function(camundaEndpoint) {
    //       self.modeler.config.camundaEndpoint = camundaEndpoint;
    //     }
    //   });
    //   editorActions.register({
    //     nisqAnalyzerEndpointChanged: function(nisqAnalyzerEndpoint) {
    //       self.modeler.config.nisqAnalyzerEndpoint = nisqAnalyzerEndpoint;
    //     }
    //   });
    //   editorActions.register({
    //     opentoscaEndpointChanged: function(opentoscaEndpoint) {
    //       self.modeler.config.opentoscaEndpoint = opentoscaEndpoint;
    //     }
    //   });
    //   editorActions.register({
    //     qrmRepoNameChanged: function(qrmRepoName) {
    //       self.modeler.config.qrmRepoName = qrmRepoName;
    //     }
    //   });
    //   editorActions.register({
    //     qrmUserNameChanged: function(qrmUserName) {
    //       self.modeler.config.qrmUserName = qrmUserName;
    //     }
    //   });
    //   editorActions.register({
    //     qrmRepoPathChanged: function(qrmRepoPath) {
    //       self.modeler.config.qrmRepoPath = qrmRepoPath;
    //     }
    //   });
    //   editorActions.register({
    //     transformationFrameworkEndpointChanged: function(transformationFrameworkEndpoint) {
    //       self.modeler.config.transformationFrameworkEndpoint = transformationFrameworkEndpoint;
    //     }
    //   });
    //   editorActions.register({
    //     wineryEndpointChanged: function(wineryEndpoint) {
    //       self.modeler.config.wineryEndpoint = wineryEndpoint;
    //       eventBus.fire('config.updated', self.modeler.config);
    //     }
    //   });
    //   editorActions.register({
    //     qiskitRuntimeHandlerEndpointChanged: function(qiskitRuntimeHandlerEndpoint) {
    //       self.modeler.config.qiskitRuntimeHandlerEndpoint = qiskitRuntimeHandlerEndpoint;
    //       eventBus.fire('config.updated', self.modeler.config);
    //     }
    //   });
    //   editorActions.register({
    //     awsRuntimeHandlerEndpointChanged: function(awsRuntimeHandlerEndpoint) {
    //       self.modeler.config.awsRuntimeHandlerEndpoint = awsRuntimeHandlerEndpoint;
    //       eventBus.fire('config.updated', self.modeler.config);
    //     }
    //   });
    //   editorActions.register({
    //     hybridRuntimeProvenanceChanged: function(hybridRuntimeProvenance) {
    //       self.modeler.config.hybridRuntimeProvenance = hybridRuntimeProvenance;
    //       eventBus.fire('config.updated', self.modeler.config);
    //     }
    //   });
    //   editorActions.register({
    //     scriptSplitterEndpointChanged: function(scriptSplitterEndpoint) {
    //       self.modeler.config.scriptSplitterEndpoint = scriptSplitterEndpoint;
    //       eventBus.fire('config.updated', self.modeler.config);
    //     }
    //   });
    //   editorActions.register({
    //     scriptSplitterThresholdChanged: function(scriptSplitterEndpoint) {
    //       self.modeler.config.scriptSplitterThreshold = scriptSplitterEndpoint;
    //     }
    //   });
    // });

    // // change to modeler corresponding to the active tab
    // this.props.subscribe('app.activeTabChanged', ({ activeTab }) => {
    //   if (this.modeler) {
    //
    //     // copy config from old active modeler to new active modeler
    //     const config = this.modeler.config;
    //     this.modeler = this.modelers[activeTab.id];
    //     this.modeler.config = config;
    //     this.modeler.get('eventBus').fire('config.updated', config);
    //   }
    // });
  }

  handleConfigClosed(newConfig) {
    this.setState({ configOpen: false });

    // update configuration in frontend and backend if passed through the modal
    if (newConfig) {
      this.modeler.config = newConfig;
      setCamundaEndpoint(newConfig.camundaEndpoint);
      setOpenTOSCAEndpoint(newConfig.opentoscaEndpoint);
      setWineryEndpoint(newConfig.wineryEndpoint);
      setNisqAnalyzerEndpoint(newConfig.nisqAnalyzerEndpoint);
      setTransformationFrameworkEndpoint(newConfig.transformationFrameworkEndpoint);
      setQiskitRuntimeHandlerEndpoint(newConfig.qiskitRuntimeHandlerEndpoint);
      setAWSRuntimeHandlerEndpoint(newConfig.awsRuntimeHandlerEndpoint);
      setScriptSplitterEndpoint(newConfig.scriptSplitterEndpoint);
      setScriptSplitterThreshold(newConfig.scriptSplitterThreshold);
      setQRMRepositoryName(newConfig.qrmRepoName);
      setQRMUserName(newConfig.qrmUserName);
      setQRMRepositoryPath(newConfig.qrmRepoPath);
      setHybridRuntimeProvenance(newConfig.hybridRuntimeProvenance);
      // config.camundaEndpoint = newConfig.camundaEndpoint
      // config.opentoscaEndpoint = newConfig.opentoscaEndpoint
      // config.wineryEndpoint = newConfig
      // config.nisqAnalyzerEndpoint = newConfig
      // config.transformationFrameworkEndpoint = newConfig
      // config.qiskitRuntimeHandlerEndpoint = newConfig
      // config.awsRuntimeHandlerEndpoint = newConfig
      // config.scriptSplitterEndpoint = newConfig
      // config.scriptSplitterThreshold = newConfig
      // config.qrmRepoName = newConfig
      // config.qrmUserName = new
      // config.qrmRepoPath =
      // config.hybridRuntimeProvenance =
      // this.backendConfig.setConfigFromModal(newConfig);
    }
  }

  render() {

    // render config button and pop-up menu
    return (<Fragment>
      <div style={{display: 'flex'}} slot="toolbar">
        <button type="button" className="toolbar-btn" title="Open configuration menu"
          onClick={() => this.setState({ configOpen: true })}>
          <span className="config"><span className="indent">Configuration</span></span>
        </button>
      </div>
      {this.state.configOpen && (
        <ConfigModal
          onClose={this.handleConfigClosed}
          initValues={this.modeler.config}
        />
      )}
    </Fragment>);
  }
}
