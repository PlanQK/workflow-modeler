const { setPluginConfig, resetConfig } = require("../../../modeler-component/editor/plugin/PluginConfigHandler");
const { updateQRMs, resetQRMs } = require("../../../modeler-component/extensions/quantme/qrm-manager");
const { getFoldersInRepository } = require("../../../modeler-component/extensions/quantme/qrm-manager/git-handler");
const { startQuantmeReplacementProcess } = require("../../../modeler-component/extensions/quantme/replacement/QuantMETransformator");
const { validQuantMEDiagram, validQuantMESubprocessDiagram } = require("../helpers/DiagramHelper");
const config = require("../../../modeler-component/extensions/quantme/framework-config/config-manager");
const camundaConfig = require("../../../modeler-component/editor/config/EditorConfigManager");
const chai = require("chai");
describe('Test the QuantMETransformator of the QuantME extension.', function () {

    describe('Transformation of QuantME extensions', function () {

        it('should create a valid native workflow model after two transformations', async function () {
            setPluginConfig([{ name: 'dataflow' },
            {
                name: 'quantme',
                config: {
                    githubRepositoryName: 'QuantME-UseCases',
                    githubUsername: 'UST-QuAntiL',
                    githubRepositoryPath: '2023-icwe/qrms'
                }
            }]
            );
            this.timeout(60000);

            let qrms = await updateQRMs();
            chai.expect(qrms.length).to.equal(10);

            config.setQRMUserName('UST-QuAntiL');
            config.setQRMRepositoryName('QuantME-UseCases');
            config.setQRMRepositoryPath('2023-icwe/part2');

            let qrmMaxCut = await updateQRMs();
            chai.expect(qrmMaxCut.length).to.equal(1);
            let allQrms = qrms.concat(qrmMaxCut);

            // remove the optimization QRM
            let qrmsFirstTransformation = qrms.slice(0, 5).concat(qrms.slice(6)).concat(qrmMaxCut);
            let expectedExpandedAttributes = [];
            for (let i = 0; i < qrmsFirstTransformation.length; i++) {
                let expandedAttributes = extractIsExpandedAttribute(qrmsFirstTransformation[i].replacement);
                expectedExpandedAttributes = expectedExpandedAttributes.concat(expandedAttributes);
            }
            const result = await startQuantmeReplacementProcess(validQuantMESubprocessDiagram, qrmsFirstTransformation, {
                nisqAnalyzerEndpoint: config.getNisqAnalyzerEndpoint(),
                transformationFrameworkEndpoint: config.getTransformationFrameworkEndpoint(),
                camundaEndpoint: camundaConfig.getCamundaEndpoint()
            });

            chai.expect(result.status).to.equal('transformed');
            let expandedFirstTransformation = extractIsExpandedAttribute(result.xml);
            chai.expect(expandedFirstTransformation).to.deep.equal(expectedExpandedAttributes);

            chai.expect(result.status).to.equal('transformed');
            expectedExpandedAttributes = [];
            allQrms = allQrms.concat(qrms.slice(5, 6));
            for (let i = 0; i < allQrms.length; i++) {
                let expandedAttributes = extractIsExpandedAttribute(allQrms[i].replacement);
                expectedExpandedAttributes = expectedExpandedAttributes.concat(expandedAttributes);
            }

            const transformationResult = await startQuantmeReplacementProcess(result.xml, allQrms, {
                nisqAnalyzerEndpoint: config.getNisqAnalyzerEndpoint(),
                transformationFrameworkEndpoint: config.getTransformationFrameworkEndpoint(),
                camundaEndpoint: camundaConfig.getCamundaEndpoint()
            });

            chai.expect(transformationResult.status).to.equal('transformed');
            let expandedSecondTransformation = extractIsExpandedAttribute(transformationResult.xml);
            chai.expect(expandedSecondTransformation).to.deep.equal(expectedExpandedAttributes);

            // check that all extension elements are replaced
            chai.expect(transformationResult.xml).to.not.contain('<quantme:');

            //clean up
            resetQRMs();
        });

        it('should fail due to missing QRMs', async function () {
            resetQRMs();
            // setConfig();
            setPluginConfig([{ name: 'dataflow' }, { name: 'quantme' }]);
            this.timeout(60000);

            const result = await startQuantmeReplacementProcess(validQuantMEDiagram, [], {
                nisqAnalyzerEndpoint: config.getNisqAnalyzerEndpoint(),
                transformationFrameworkEndpoint: config.getTransformationFrameworkEndpoint(),
                camundaEndpoint: camundaConfig.getCamundaEndpoint()
            });

            // check transformation failed because of missing QRMs
            chai.expect(result.status).to.equal('failed');
            chai.expect(result.cause).to.contain('by suited QRM!');
        });
    });
});

function extractIsExpandedAttribute(xmlString) {

    // Create a DOMParser instance
    const parser = new DOMParser();

    // Parse the XML string and extract all subprocesses 
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const regexPattern = /\<\w+:subProcess[^>]*>/g;
    const matches = xmlString.match(regexPattern);

    let expanded = [];

    // Regular expression pattern to extract bpmndi:BPMNShape elements
    const shapeRegexPattern = /<bpmndi:BPMNShape[^>]*>/g;

    // Regular expression pattern to extract isExpanded attribute value
    const isExpandedRegexPattern = /isExpanded="([^"]+)"/;

    // Extract the bpmndi:BPMNShape elements using the regular expression
    const shapeMatches = xmlString.match(shapeRegexPattern);

    // Loop through the shape matches and extract the isExpanded attribute
    for (let i = 0; i < shapeMatches.length; i++) {
        const shapeMatch = shapeMatches[i];

        // Extract the bpmnElement attribute value
        const bpmnElementMatch = shapeMatch.match(/bpmnElement="([^"]+)"/);
        if (bpmnElementMatch && bpmnElementMatch.length > 1) {
            const bpmnElement = bpmnElementMatch[1];

            // Extract the isExpanded attribute value
            const isExpandedMatch = shapeMatch.match(isExpandedRegexPattern);
            let positionCircuitCutting = xmlString.search('circuitCuttingSubprocess id="' + bpmnElement + '"');
            let positionSubProcess = xmlString.search('subProcess id="' + bpmnElement + '"');

            if (positionCircuitCutting > -1 || positionSubProcess > -1) {
                if (isExpandedMatch && isExpandedMatch.length > 1) {
                    const isExpanded = isExpandedMatch[1];

                    if (isExpanded !== undefined) {
                        expanded.push(isExpanded);
                    }
                } else {
                    expanded.push('false');
                }
            }
        }
    }
    return expanded;
}