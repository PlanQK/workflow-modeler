import PatternOverviewModal from "./PatternOverviewModal";
import PatternModal from "./PatternModal";
import React, { PureComponent } from "react";
import { getModeler } from "../../../../editor/ModelerHandler";
import { fetchDataFromEndpoint } from "../../utilities/Utilities"; // Import your API function

const defaultState = {
  patternOverviewOpen: false,
  patternOpen: false,
  responseData: null, // Store the response data from the API
};

export default class PatternSelectionPlugin extends PureComponent {
  constructor(props) {
    super(props);

    this.modeler = getModeler();

    this.state = defaultState;

    // get QuantME component from the backend, e.g., to retrieve current QRMs
    this.quantME = "";
  }


  async fetchData() {
    try {
      console.log(this.modeler.config);
      const response = await fetchDataFromEndpoint(this.modeler.config.patternAtlasEndpoint);
      console.log(response);

      this.setState({ responseData: response['_embedded']['patternModels'] });
    } catch (error) {
      console.error("Error fetching data from the endpoint:", error);
    }
  }

  render() {
    // Render loop analysis button and pop-up menu
    return (
      <>
        <div style={{ display: "flex" }}>
          <button
            type="button"
            className="qwm-toolbar-btn"
            title="Open Pattern Selection"
            onClick={() => {this.setState({ patternOpen: true }); this.fetchData()}}
          >
            <span className="hybrid-loop-adaptation">
              <span className="qwm-indent">Open Pattern Selection</span>
            </span>
          </button>
        </div>
        {this.state.patternOpen && (
          <PatternModal
            onClose={() => this.setState({ patternOverviewOpen: true })} // Pass the response data as a prop
          />
        )}
        {this.state.patternOverviewOpen && (
          <PatternOverviewModal
            onClose={() => this.setState({ patternOverviewOpen: false, patternOpen: false })}
            responseData={this.state.responseData} // Pass the response data as a prop
          />
        )}
      </>
    );
  }
}
