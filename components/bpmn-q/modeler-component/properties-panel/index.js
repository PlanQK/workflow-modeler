import ReactDOM from 'react-dom/client';
import React from 'react';

import PropertiesView from './PropertiesView';


export default class PropertiesPanel extends HTMLElement{

  constructor(options) {
    super()

    const {
      modeler,
      container
    } = options;

    ReactDOM.createRoot(
      <PropertiesView modeler={ modeler } />,
      container
    );
  }
}


