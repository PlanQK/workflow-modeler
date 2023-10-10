import AdaptationModal from "./AdaptationModal";
import React, { PureComponent } from "react";
import { getModeler } from "../../../../editor/ModelerHandler";
import { fetchDataFromEndpoint } from "../../utilities/Utilities"; // Import your API function

const defaultState = {
  adaptationOpen: false,
  responseData: null, // Store the response data from the API
};

export default class AdaptationPlugin extends PureComponent {
  constructor(props) {
    super(props);

    this.modeler = getModeler();

    this.state = defaultState;

    // get QuantME component from the backend, e.g., to retrieve current QRMs
    this.quantME = "";
  }

  async componentDidMount() {
    try {
      // Make the API request when the component mounts
      const response = await fetchDataFromEndpoint(); // Replace with your API function
      console.log(response);


      // Update the state with the response data
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
            title="Update patterns"
            onClick={() => this.setState({ adaptationOpen: true })}
          >
            <span className="hybrid-loop-adaptation">
              <span className="qwm-indent">Open Pattern Selection</span>
            </span>
          </button>
        </div>
        {this.state.adaptationOpen && (
          <AdaptationModal
            onClose={() => this.setState({ adaptationOpen: false })}
            responseData={this.state.responseData} // Pass the response data as a prop
          />
        )}
      </>
    );
  }
}
