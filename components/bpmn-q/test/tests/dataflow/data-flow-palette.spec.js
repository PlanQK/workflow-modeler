import { expect } from "chai";
import { setPluginConfig } from "../../../modeler-component/editor/plugin/PluginConfigHandler";
import { createTempModeler } from "../../../modeler-component/editor/ModelerHandler";
describe("Test the DataFlow palette provider", function () {
  it("Should contain palette entries for data flow elements", function () {
    setPluginConfig([{ name: "dataflow" }]);

    const modeler = createTempModeler();

    const dataFlowPaletteProvider = modeler.get("dataFlowPaletteProvider");

    const paletteEntries = dataFlowPaletteProvider.getPaletteEntries();

    expect(paletteEntries["create.dataflow-data-map-object"]).to.exist;
    expect(paletteEntries["create.dataflow-data-store-map"]).to.exist;
    expect(paletteEntries["create.data-flow-transformation-task"]).to.exist;
  });
});
