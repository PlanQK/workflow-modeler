import { expect } from "chai";
import { createTempModeler } from "../../../../modeler-component/editor/ModelerHandler";
import { loadDiagram } from "../../../../modeler-component/editor/util/IoUtilities";
import {
  BRANCHED_WORKFLOW,
  DATA_START_EVENT_WORKFLOW,
} from "../../helpers/BPMNWorkflowHelper";
import {
  findSequenceFlowConnection,
  isConnectedWith,
} from "../../../../modeler-component/editor/util/ModellingUtilities";

describe("Test ModellingUtils.js", function () {
  describe("Test findSequenceFlowConnection", function () {
    let modeler;
    let elementRegistry;

    beforeEach(
      "Create new modeler instance with loaded example workflow",
      async function () {
        modeler = createTempModeler();
        await loadDiagram(BRANCHED_WORKFLOW, modeler);
        elementRegistry = modeler.get("elementRegistry");
      }
    );

    it("Should find direct connection", function () {
      const task21 = elementRegistry.get("Task21");
      const task3 = elementRegistry.get("Task3");

      const isConnected = findSequenceFlowConnection(
        task21,
        task3,
        new Set(),
        elementRegistry
      );
      expect(isConnected).to.be.true;
    });

    it("Should find connection through gateways", function () {
      const task1 = elementRegistry.get("Task1");
      const task42 = elementRegistry.get("Task42");

      const isConnected = findSequenceFlowConnection(
        task1,
        task42,
        new Set(),
        elementRegistry
      );
      expect(isConnected).to.be.true;
    });

    it("Should find connection with the same task", function () {
      const task1 = elementRegistry.get("Task1");

      const isConnected = findSequenceFlowConnection(
        task1,
        task1,
        new Set(),
        elementRegistry
      );
      expect(isConnected).to.be.true;
    });

    it("Should find connection through loops", function () {
      const task3 = elementRegistry.get("Task3");
      const task21 = elementRegistry.get("Task21");

      const isConnected = findSequenceFlowConnection(
        task3,
        task21,
        new Set(),
        elementRegistry
      );
      expect(isConnected).to.be.true;
    });

    it("Should not find connection reverse to the direction of the control flow", function () {
      const task21 = elementRegistry.get("Task21");
      const task1 = elementRegistry.get("Task1");

      let isConnected = findSequenceFlowConnection(
        task21,
        task1,
        new Set(),
        elementRegistry
      );
      expect(isConnected).to.be.false;

      const task41 = elementRegistry.get("Task41");
      const task42 = elementRegistry.get("Task42");

      isConnected = findSequenceFlowConnection(
        task41,
        task42,
        new Set(),
        elementRegistry
      );
      expect(isConnected).to.be.false;
    });
  });

  describe("Test isConnectedWith()", function () {
    let modeler;
    let elementRegistry;

    beforeEach(
      "Create new modeler instance with loaded example workflow",
      async function () {
        modeler = createTempModeler();
        await loadDiagram(DATA_START_EVENT_WORKFLOW, modeler);
        elementRegistry = modeler.get("elementRegistry");
      }
    );

    it("Should be connected with StartEvent", function () {
      const data1 = elementRegistry.get("Data1");

      expect(data1).to.exist;

      const isConnected = isConnectedWith(data1, "bpmn:StartEvent");
      expect(isConnected).to.be.true;
    });

    it("Should not be connected with StartEvent", function () {
      const data2 = elementRegistry.get("Data2");

      expect(data2).to.exist;

      const isConnected = isConnectedWith(data2, "bpmn:StartEvent");
      expect(isConnected).to.be.false;
    });

    it("Should be connected with Task", function () {
      const start1 = elementRegistry.get("Start1");

      expect(start1).to.exist;

      const isConnected = isConnectedWith(start1, "bpmn:Task");
      expect(isConnected).to.be.true;
    });
  });
});
