import chai from "chai";
import { getPatternSolutionQRMs } from "../../../modeler-component/extensions/quantme/qrm-manager/qrm-handler";
describe("Test the pattern plugin", function () {
  it("Should load solutions as QRMs", async function () {
    const patternQRMs = await getPatternSolutionQRMs();

    chai.expect(patternQRMs.length).to.equal(4);
  });
});
