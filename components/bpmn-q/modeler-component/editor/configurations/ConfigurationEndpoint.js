import * as consts from '../../extensions/data-extension/Constants';
import {nextId} from '../../extensions/data-extension/properties-panel/util';

export default class ConfigurationsEndpoint {

  // array containing the fetched configurations
  _configurations = [];

  constructor(endpointUrl) {
    this._endpointUrl = endpointUrl;
  }

  fetchConfigurations() {

    // fetch new configurations from repository
    return [
      {
        name: 'XML to JSON Transformation',
        id: 'fhjsdfjksghdjkfgsdfjkgkjserg1dfg12sd2g21s', // probably not needed?
        description: "Transforms a XML file into a JSON file",
        appliesTo: "dataflow:TransformationTask",
        attributes: [
          {
            name: 'xml-schema',
            label: 'XML Schema',
            type: 'string',
            value: '',
            editable: 'false',
            bindTo: 'parameters',
            bindToIsMany: true,
          }
        ]
      },
      {
        name: "Facebook Login",
        id: "FBLogin",
        description: "Login in einen Facebook Account",
        appliesTo: "dataflow:TransformationTask",
        attributes: [
          {
            name: "RedirectUrl",
            label: "Redirect URL",
            // value: "",
            type: "string", // string, boolean, selection
            editable: true,
            bindTo: "parameters",
            bindToIsMany: true,
          },
          {
            name: "Url",
            label: "Redirect URL",
            value: "facebook.de/login",
            type: "string", // string, boolean, selection
            editable: true,
            bindTo: "parameters",
            bindToIsMany: true,
          }
        ]
      }
    ];
  }

  getConfigurations(type) {

    // fetch configurations if no configurations are available
    if (this._configurations.length === 0) {
      this._configurations = this.fetchConfigurations();
    }

    return this._configurations.filter(function(configuration) {

      // return all configurations which apply to the given type
      if (configuration.appliesTo === type) {
        return configuration;
      }
    });
  }
}