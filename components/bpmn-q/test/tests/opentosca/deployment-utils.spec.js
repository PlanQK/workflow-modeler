import {validQuantMEDiagram} from "../helpers/DiagramHelper";
import {createTempModelerFromXml} from "../../../modeler-component/editor/ModelerHandler";
import {getServiceTasksToDeploy} from "../../../modeler-component/extensions/opentosca/deployment/DeploymentUtils";
import {getRootProcess} from "../../../modeler-component/editor/util/ModellingUtilities";
import {setPluginConfig} from "../../../modeler-component/editor/plugin/PluginConfigHandler";
import {expect} from 'chai';

describe('Test the CSAR extraction.', function () {


    it('should get service tasks to deploy from model', async function () {
        setPluginConfig([{
            name: 'dataflow',
            config: {}
        }, {
            name: 'quantme',
            config: {
                test: 'test',
            }
        }, {
            name: 'opentosca',
            config: {
                test: 'test',
            }
        }]);
        const modeler = await createTempModelerFromXml(validQuantMEDiagram);
        let csarsToDeploy = getServiceTasksToDeploy(getRootProcess(modeler.getDefinitions()));
        expect(csarsToDeploy.length).to.equal(1);
        expect(csarsToDeploy[0].url).to.equal('{{ wineryEndpoint }}/servicetemplates/http%253A%252F%252Fquantil.org%252Fquantme%252Fpull/KMeansInitializerService/?csar');
        expect(csarsToDeploy[0].csarName).to.equal('KMeansInitializerService.csar');
    });
});