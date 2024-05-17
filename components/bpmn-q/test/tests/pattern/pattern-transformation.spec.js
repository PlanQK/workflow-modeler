const { validPatternDiagram } = require("../helpers/DiagramHelper");
const chai = require("chai");
const {
  WARM_STARTING_TASK,
  QUANTUM_CIRCUIT_LOADING_TASK,
  CIRCUIT_CUTTING_TASK,
  CUTTING_RESULT_COMBINATION_TASK,
  READOUT_ERROR_MITIGATION_TASK,
  RESULT_EVALUATION_TASK,
  QUANTUM_CIRCUIT_EXECUTION_TASK,
} = require("../../../modeler-component/extensions/quantme/Constants");
const {
  startPatternReplacementProcess,
} = require("../../../modeler-component/extensions/pattern/replacement/PatternTransformator");
const { instantiateModeler } = require("../helpers/ModelerHelper");
describe("Test the PatternTransformator of the Pattern extension.", function () {
  describe("Transformation of Pattern extensions", function () {
    it("should replace all patterns by quantme modeling constructs", async function () {
      const transformationResult = await startPatternReplacementProcess(
        validPatternDiagram
      );
      console.log("Pattern replacement terminated!");

      chai.expect(transformationResult.status).to.equal("transformed");
      chai
        .expect(transformationResult.xml)
        .to.contain("<quantme:warmStartingTask");
      chai
        .expect(transformationResult.xml)
        .to.contain("<quantme:circuitCuttingTask");
      chai
        .expect(transformationResult.xml)
        .to.contain("<quantme:cuttingResultCombinationTask");
      chai
        .expect(transformationResult.xml)
        .to.contain("<quantme:readoutErrorMitigationTask");

      console.log("Evaluating resulting XML!");
      const modeler = await instantiateModeler(transformationResult.xml);
      const elements = modeler.get("elementRegistry").getAll();
      for (let element of elements) {
        if (element.type === WARM_STARTING_TASK) {
          chai.expect(element.outgoing.length).to.equal(1);
          chai
            .expect(element.outgoing[0].target.type)
            .to.equal(QUANTUM_CIRCUIT_LOADING_TASK);
        }
        if (element.type === CIRCUIT_CUTTING_TASK) {
          chai.expect(element.incoming.length).to.equal(1);
          chai
            .expect(element.incoming[0].source.type)
            .to.equal("bpmn:ExclusiveGateway");
          chai.expect(element.outgoing.length).to.equal(1);
          chai
            .expect(element.outgoing[0].target.type)
            .to.equal(QUANTUM_CIRCUIT_EXECUTION_TASK);
          chai.expect(element.cuttingMethod).to.equal("knitting toolbox");
        }
        if (element.type === CUTTING_RESULT_COMBINATION_TASK) {
          chai.expect(element.incoming.length).to.equal(1);
          chai
            .expect(element.incoming[0].source.type)
            .to.equal(QUANTUM_CIRCUIT_EXECUTION_TASK);
          chai.expect(element.outgoing.length).to.equal(1);
          chai
            .expect(element.outgoing[0].target.type)
            .to.equal(READOUT_ERROR_MITIGATION_TASK);
          chai.expect(element.cuttingMethod).to.equal("knitting toolbox");
        }
        if (element.type === READOUT_ERROR_MITIGATION_TASK) {
          chai.expect(element.incoming.length).to.equal(1);
          chai
            .expect(element.incoming[0].source.type)
            .to.equal(CUTTING_RESULT_COMBINATION_TASK);
          chai.expect(element.outgoing.length).to.equal(1);
          chai
            .expect(element.outgoing[0].target.type)
            .to.equal(RESULT_EVALUATION_TASK);
        }
        console.log("Pattern test terminated!");

        // TODO: add transformation + check result
      }
    }).timeout(10000);
  });
});
