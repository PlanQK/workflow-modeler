const validPlanqkDiagram = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:planqk="https://platform.planqk.de" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">\n' +
    '  <bpmn2:process id="Process_1" isExecutable="false">\n' +
    '    <bpmn2:startEvent id="StartEvent_1">\n' +
    '      <bpmn2:outgoing>Flow_11l0uo0</bpmn2:outgoing>\n' +
    '    </bpmn2:startEvent>\n' +
    '    <bpmn2:sequenceFlow id="Flow_11l0uo0" sourceRef="StartEvent_1" targetRef="Activity_087q8te" />\n' +
    '    <planqk:serviceTask id="Activity_087q8te" name="Seppones API" subscriptionId="sub1" applicationName="Seppones App" tokenEndpoint="www.seppone-gateway.de/api1" consumerKey="app1ConsumerKey" consumerSecret="app1ConsumerSecret" serviceName="Seppones API" serviceEndpoint="http://dummy.com/api1/v1" data="{}" params="{}" result="${output}">\n' +
    '      <bpmn2:incoming>Flow_11l0uo0</bpmn2:incoming>\n' +
    '      <bpmn2:outgoing>Flow_0k7wb56</bpmn2:outgoing>\n' +
    '      <bpmn2:property id="Property_1y4jr3x" name="__targetRef_placeholder" />\n' +
    '      <bpmn2:dataInputAssociation id="DataInputAssociation_1uuujuu">\n' +
    '        <bpmn2:sourceRef>DataPool_049grpp</bpmn2:sourceRef>\n' +
    '        <bpmn2:targetRef>Property_1y4jr3x</bpmn2:targetRef>\n' +
    '      </bpmn2:dataInputAssociation>\n' +
    '    </planqk:serviceTask>\n' +
    '    <bpmn2:endEvent id="Event_1eice1m">\n' +
    '      <bpmn2:incoming>Flow_0k7wb56</bpmn2:incoming>\n' +
    '    </bpmn2:endEvent>\n' +
    '    <bpmn2:sequenceFlow id="Flow_0k7wb56" sourceRef="Activity_087q8te" targetRef="Event_1eice1m" />\n' +
    '    <planqk:dataPool id="DataPool_049grpp" name="Infinite Data Pool" dataPoolName="Infinite Data Pool" dataPoolLink="https://platform.planqk.de/datapools/2a7d74a6-0fb5-400a-asd3-7125aef5613e/" dataPoolDescription="A dataset with an infinite amount of data to train endless models." dataPoolId="2a7d74a6-0fb5-400a-asd3-7125aef5613e" />\n' +
    '  </bpmn2:process>\n' +
    '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
    '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
    '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n' +
    '        <dc:Bounds x="412" y="240" width="36" height="36" />\n' +
    '      </bpmndi:BPMNShape>\n' +
    '      <bpmndi:BPMNShape id="Activity_1y3t12w_di" bpmnElement="Activity_087q8te">\n' +
    '        <dc:Bounds x="500" y="218" width="100" height="80" />\n' +
    '        <bpmndi:BPMNLabel />\n' +
    '      </bpmndi:BPMNShape>\n' +
    '      <bpmndi:BPMNShape id="Event_1eice1m_di" bpmnElement="Event_1eice1m">\n' +
    '        <dc:Bounds x="652" y="240" width="36" height="36" />\n' +
    '      </bpmndi:BPMNShape>\n' +
    '      <bpmndi:BPMNShape id="DataPool_049grpp_di" bpmnElement="DataPool_049grpp">\n' +
    '        <dc:Bounds x="405" y="335" width="50" height="50" />\n' +
    '        <bpmndi:BPMNLabel>\n' +
    '          <dc:Bounds x="390" y="392" width="80" height="14" />\n' +
    '        </bpmndi:BPMNLabel>\n' +
    '      </bpmndi:BPMNShape>\n' +
    '      <bpmndi:BPMNEdge id="Flow_11l0uo0_di" bpmnElement="Flow_11l0uo0">\n' +
    '        <di:waypoint x="448" y="258" />\n' +
    '        <di:waypoint x="500" y="258" />\n' +
    '      </bpmndi:BPMNEdge>\n' +
    '      <bpmndi:BPMNEdge id="Flow_0k7wb56_di" bpmnElement="Flow_0k7wb56">\n' +
    '        <di:waypoint x="600" y="258" />\n' +
    '        <di:waypoint x="652" y="258" />\n' +
    '      </bpmndi:BPMNEdge>\n' +
    '      <bpmndi:BPMNEdge id="DataInputAssociation_1uuujuu_di" bpmnElement="DataInputAssociation_1uuujuu">\n' +
    '        <di:waypoint x="455" y="360" />\n' +
    '        <di:waypoint x="550" y="360" />\n' +
    '        <di:waypoint x="550" y="298" />\n' +
    '      </bpmndi:BPMNEdge>\n' +
    '    </bpmndi:BPMNPlane>\n' +
    '  </bpmndi:BPMNDiagram>\n' +
    '</bpmn2:definitions>\n';

const transformedValidPlanqkDiagram = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">\n' +
    '  <bpmn2:process id="Process_1" isExecutable="true">\n' +
    '    <bpmn2:extensionElements>\n' +
    '      <camunda:executionListener expression="${execution.setVariable(&#34;Infinite Data Pool&#34;, &#34;https://platform.planqk.de/datapools/2a7d74a6-0fb5-400a-asd3-7125aef5613e/&#34;)}" event="start" />\n' +
    '    </bpmn2:extensionElements>\n' +
    '    <bpmn2:startEvent id="StartEvent_1">\n' +
    '      <bpmn2:outgoing>Flow_11l0uo0</bpmn2:outgoing>\n' +
    '    </bpmn2:startEvent>\n' +
    '    <bpmn2:sequenceFlow id="Flow_11l0uo0" sourceRef="StartEvent_1" targetRef="Activity_087q8te" />\n' +
    '    <bpmn2:endEvent id="Event_1eice1m">\n' +
    '      <bpmn2:incoming>Flow_0k7wb56</bpmn2:incoming>\n' +
    '    </bpmn2:endEvent>\n' +
    '    <bpmn2:sequenceFlow id="Flow_0k7wb56" sourceRef="Activity_087q8te" targetRef="Event_1eice1m" />\n' +
    '    <bpmn2:subProcess id="Activity_087q8te" name="PlanQK Service Interaction" camunda:asyncAfter="true">\n' +
    '      <bpmn2:extensionElements>\n' +
    '        <camunda:inputOutput>\n' +
    '          <camunda:inputParameter name="params">{}</camunda:inputParameter>\n' +
    '          <camunda:inputParameter name="data">{}</camunda:inputParameter>\n' +
    '          <camunda:inputParameter name="executionState" />\n' +
    '          <camunda:inputParameter name="executionId" />\n' +
    '          <camunda:inputParameter name="serviceEndpoint">http://dummy.com/api1/v1</camunda:inputParameter>\n' +
    '          <camunda:inputParameter name="tokenEndpoint">www.seppone-gateway.de/api1</camunda:inputParameter>\n' +
    '          <camunda:inputParameter name="consumerSecret">app1ConsumerSecret</camunda:inputParameter>\n' +
    '          <camunda:inputParameter name="consumerKey">app1ConsumerKey</camunda:inputParameter>\n' +
    '          <camunda:outputParameter name="output">${result}</camunda:outputParameter>\n' +
    '        </camunda:inputOutput>\n' +
    '      </bpmn2:extensionElements>\n' +
    '      <bpmn2:incoming>Flow_11l0uo0</bpmn2:incoming>\n' +
    '      <bpmn2:outgoing>Flow_0k7wb56</bpmn2:outgoing>\n' +
    '      <bpmn2:property id="Property_1q2avq2" name="__targetRef_placeholder" />\n' +
    '      <bpmn2:dataInputAssociation id="DataInputAssociation_1uuujuu">\n' +
    '        <bpmn2:sourceRef>DataPool_049grpp</bpmn2:sourceRef>\n' +
    '        <bpmn2:targetRef>Property_1q2avq2</bpmn2:targetRef>\n' +
    '      </bpmn2:dataInputAssociation>\n' +
    '      <bpmn2:startEvent id="Event_09tjaib" name="Start Interaction">\n' +
    '        <bpmn2:outgoing>Flow_1dm9t5d</bpmn2:outgoing>\n' +
    '      </bpmn2:startEvent>\n' +
    '      <bpmn2:intermediateCatchEvent id="Event_1fzys9l">\n' +
    '        <bpmn2:incoming>Flow_1382lgm</bpmn2:incoming>\n' +
    '        <bpmn2:incoming>Flow_0482sfu</bpmn2:incoming>\n' +
    '        <bpmn2:outgoing>Flow_0nfkrrj</bpmn2:outgoing>\n' +
    '        <bpmn2:timerEventDefinition id="TimerEventDefinition_1098ktd">\n' +
    '          <bpmn2:timeDuration xsi:type="bpmn2:tFormalExpression">R/PT5S</bpmn2:timeDuration>\n' +
    '        </bpmn2:timerEventDefinition>\n' +
    '      </bpmn2:intermediateCatchEvent>\n' +
    '      <bpmn2:exclusiveGateway id="Gateway_0aaj9mn">\n' +
    '        <bpmn2:incoming>Flow_1s3f52r</bpmn2:incoming>\n' +
    '        <bpmn2:outgoing>Flow_04vby0l</bpmn2:outgoing>\n' +
    '        <bpmn2:outgoing>Flow_0482sfu</bpmn2:outgoing>\n' +
    '        <bpmn2:outgoing>Flow_1skraj1</bpmn2:outgoing>\n' +
    '      </bpmn2:exclusiveGateway>\n' +
    '      <bpmn2:serviceTask id="Activity_1on2lu0" name="Get Service Result" camunda:class="de.stoneone.planqk.workflow.serviceimpl.PlanQKServiceResultRetriever">\n' +
    '        <bpmn2:incoming>Flow_04vby0l</bpmn2:incoming>\n' +
    '        <bpmn2:outgoing>Flow_1gu42un</bpmn2:outgoing>\n' +
    '      </bpmn2:serviceTask>\n' +
    '      <bpmn2:serviceTask id="Activity_1y0ccpa" name="Call Service" camunda:class="de.stoneone.planqk.workflow.serviceimpl.PlanQKServiceCaller">\n' +
    '        <bpmn2:incoming>Flow_1dm9t5d</bpmn2:incoming>\n' +
    '        <bpmn2:outgoing>Flow_1382lgm</bpmn2:outgoing>\n' +
    '      </bpmn2:serviceTask>\n' +
    '      <bpmn2:serviceTask id="Activity_102ex0w" name="Poll Service Response" camunda:class="de.stoneone.planqk.workflow.serviceimpl.PlanQKServicePoller">\n' +
    '        <bpmn2:incoming>Flow_0nfkrrj</bpmn2:incoming>\n' +
    '        <bpmn2:outgoing>Flow_1s3f52r</bpmn2:outgoing>\n' +
    '      </bpmn2:serviceTask>\n' +
    '      <bpmn2:endEvent id="Event_0uetbx0" name="End Interaction">\n' +
    '        <bpmn2:incoming>Flow_1gu42un</bpmn2:incoming>\n' +
    '      </bpmn2:endEvent>\n' +
    '      <bpmn2:endEvent id="Event_17zap5s">\n' +
    '        <bpmn2:incoming>Flow_1skraj1</bpmn2:incoming>\n' +
    '        <bpmn2:errorEventDefinition id="ErrorEventDefinition_1wu3a14" />\n' +
    '      </bpmn2:endEvent>\n' +
    '      <bpmn2:sequenceFlow id="Flow_04vby0l" sourceRef="Gateway_0aaj9mn" targetRef="Activity_1on2lu0">\n' +
    '        <bpmn2:conditionExpression xsi:type="bpmn2:tFormalExpression">${executionState==\'SUCCEEDED\'}</bpmn2:conditionExpression>\n' +
    '      </bpmn2:sequenceFlow>\n' +
    '      <bpmn2:sequenceFlow id="Flow_0nfkrrj" sourceRef="Event_1fzys9l" targetRef="Activity_102ex0w" />\n' +
    '      <bpmn2:sequenceFlow id="Flow_1382lgm" sourceRef="Activity_1y0ccpa" targetRef="Event_1fzys9l" />\n' +
    '      <bpmn2:sequenceFlow id="Flow_1s3f52r" sourceRef="Activity_102ex0w" targetRef="Gateway_0aaj9mn" />\n' +
    '      <bpmn2:sequenceFlow id="Flow_0482sfu" sourceRef="Gateway_0aaj9mn" targetRef="Event_1fzys9l">\n' +
    '        <bpmn2:conditionExpression xsi:type="bpmn2:tFormalExpression">${executionState==\'PENDING\'}</bpmn2:conditionExpression>\n' +
    '      </bpmn2:sequenceFlow>\n' +
    '      <bpmn2:sequenceFlow id="Flow_1dm9t5d" sourceRef="Event_09tjaib" targetRef="Activity_1y0ccpa" />\n' +
    '      <bpmn2:sequenceFlow id="Flow_1gu42un" sourceRef="Activity_1on2lu0" targetRef="Event_0uetbx0" />\n' +
    '      <bpmn2:sequenceFlow id="Flow_1skraj1" sourceRef="Gateway_0aaj9mn" targetRef="Event_17zap5s">\n' +
    '        <bpmn2:conditionExpression xsi:type="bpmn2:tFormalExpression">${executionState==\'FAILED\' || executionState==\'UNKNOWN\'}</bpmn2:conditionExpression>\n' +
    '      </bpmn2:sequenceFlow>\n' +
    '    </bpmn2:subProcess>\n' +
    '    <bpmn2:dataStoreReference id="DataPool_049grpp" name="Infinite Data Pool" />\n' +
    '  </bpmn2:process>\n' +
    '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
    '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
    '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n' +
    '        <dc:Bounds x="412" y="240" width="36" height="36" />\n' +
    '      </bpmndi:BPMNShape>\n' +
    '      <bpmndi:BPMNShape id="Event_1eice1m_di" bpmnElement="Event_1eice1m">\n' +
    '        <dc:Bounds x="652" y="240" width="36" height="36" />\n' +
    '      </bpmndi:BPMNShape>\n' +
    '      <bpmndi:BPMNShape id="DataStoreReference_1ysq9zt_di" bpmnElement="DataPool_049grpp">\n' +
    '        <dc:Bounds x="405" y="335" width="50" height="50" />\n' +
    '        <bpmndi:BPMNLabel>\n' +
    '          <dc:Bounds x="390" y="392" width="80" height="14" />\n' +
    '        </bpmndi:BPMNLabel>\n' +
    '      </bpmndi:BPMNShape>\n' +
    '      <bpmndi:BPMNShape id="Activity_1snj07b_di" bpmnElement="Activity_087q8te">\n' +
    '        <dc:Bounds x="-70" y="-32" width="670" height="330" />\n' +
    '        <bpmndi:BPMNLabel />\n' +
    '      </bpmndi:BPMNShape>\n' +
    '      <bpmndi:BPMNShape id="Event_09tjaib_di" bpmnElement="Event_09tjaib">\n' +
    '        <dc:Bounds x="32" y="32" width="36" height="36" />\n' +
    '        <bpmndi:BPMNLabel>\n' +
    '          <dc:Bounds x="12" y="75" width="77" height="14" />\n' +
    '        </bpmndi:BPMNLabel>\n' +
    '      </bpmndi:BPMNShape>\n' +
    '      <bpmndi:BPMNShape id="Event_1fzys9l_di" bpmnElement="Event_1fzys9l">\n' +
    '        <dc:Bounds x="32" y="32" width="36" height="36" />\n' +
    '      </bpmndi:BPMNShape>\n' +
    '      <bpmndi:BPMNShape id="Gateway_0aaj9mn_di" bpmnElement="Gateway_0aaj9mn" isMarkerVisible="true">\n' +
    '        <dc:Bounds x="25" y="25" width="50" height="50" />\n' +
    '      </bpmndi:BPMNShape>\n' +
    '      <bpmndi:BPMNShape id="Activity_1on2lu0_di" bpmnElement="Activity_1on2lu0">\n' +
    '        <dc:Bounds x="0" y="10" width="100" height="80" />\n' +
    '        <bpmndi:BPMNLabel />\n' +
    '      </bpmndi:BPMNShape>\n' +
    '      <bpmndi:BPMNShape id="Activity_1y0ccpa_di" bpmnElement="Activity_1y0ccpa">\n' +
    '        <dc:Bounds x="0" y="10" width="100" height="80" />\n' +
    '        <bpmndi:BPMNLabel />\n' +
    '      </bpmndi:BPMNShape>\n' +
    '      <bpmndi:BPMNShape id="Activity_102ex0w_di" bpmnElement="Activity_102ex0w">\n' +
    '        <dc:Bounds x="0" y="10" width="100" height="80" />\n' +
    '        <bpmndi:BPMNLabel />\n' +
    '      </bpmndi:BPMNShape>\n' +
    '      <bpmndi:BPMNShape id="Event_0uetbx0_di" bpmnElement="Event_0uetbx0">\n' +
    '        <dc:Bounds x="32" y="32" width="36" height="36" />\n' +
    '        <bpmndi:BPMNLabel>\n' +
    '          <dc:Bounds x="14" y="75" width="72" height="14" />\n' +
    '        </bpmndi:BPMNLabel>\n' +
    '      </bpmndi:BPMNShape>\n' +
    '      <bpmndi:BPMNShape id="Event_17zap5s_di" bpmnElement="Event_17zap5s">\n' +
    '        <dc:Bounds x="32" y="32" width="36" height="36" />\n' +
    '      </bpmndi:BPMNShape>\n' +
    '      <bpmndi:BPMNEdge id="Flow_04vby0l_di" bpmnElement="Flow_04vby0l">\n' +
    '        <di:waypoint x="50" y="25" />\n' +
    '        <di:waypoint x="50" y="0" />\n' +
    '        <di:waypoint x="70" y="0" />\n' +
    '        <di:waypoint x="70" y="-10" />\n' +
    '        <di:waypoint x="50" y="-10" />\n' +
    '        <di:waypoint x="50" y="10" />\n' +
    '      </bpmndi:BPMNEdge>\n' +
    '      <bpmndi:BPMNEdge id="Flow_0nfkrrj_di" bpmnElement="Flow_0nfkrrj">\n' +
    '        <di:waypoint x="50" y="32" />\n' +
    '        <di:waypoint x="50" y="10" />\n' +
    '        <di:waypoint x="70" y="10" />\n' +
    '        <di:waypoint x="70" y="-10" />\n' +
    '        <di:waypoint x="50" y="-10" />\n' +
    '        <di:waypoint x="50" y="10" />\n' +
    '      </bpmndi:BPMNEdge>\n' +
    '      <bpmndi:BPMNEdge id="Flow_1382lgm_di" bpmnElement="Flow_1382lgm">\n' +
    '        <di:waypoint x="50" y="10" />\n' +
    '        <di:waypoint x="50" y="-10" />\n' +
    '        <di:waypoint x="70" y="-10" />\n' +
    '        <di:waypoint x="70" y="10" />\n' +
    '        <di:waypoint x="50" y="10" />\n' +
    '        <di:waypoint x="50" y="32" />\n' +
    '      </bpmndi:BPMNEdge>\n' +
    '      <bpmndi:BPMNEdge id="Flow_1s3f52r_di" bpmnElement="Flow_1s3f52r">\n' +
    '        <di:waypoint x="50" y="10" />\n' +
    '        <di:waypoint x="50" y="-10" />\n' +
    '        <di:waypoint x="70" y="-10" />\n' +
    '        <di:waypoint x="70" y="0" />\n' +
    '        <di:waypoint x="50" y="0" />\n' +
    '        <di:waypoint x="50" y="25" />\n' +
    '      </bpmndi:BPMNEdge>\n' +
    '      <bpmndi:BPMNEdge id="Flow_0482sfu_di" bpmnElement="Flow_0482sfu">\n' +
    '        <di:waypoint x="50" y="25" />\n' +
    '        <di:waypoint x="50" y="10" />\n' +
    '        <di:waypoint x="70" y="10" />\n' +
    '        <di:waypoint x="70" y="20" />\n' +
    '        <di:waypoint x="50" y="20" />\n' +
    '        <di:waypoint x="50" y="32" />\n' +
    '      </bpmndi:BPMNEdge>\n' +
    '      <bpmndi:BPMNEdge id="Flow_1dm9t5d_di" bpmnElement="Flow_1dm9t5d">\n' +
    '        <di:waypoint x="50" y="32" />\n' +
    '        <di:waypoint x="50" y="10" />\n' +
    '        <di:waypoint x="70" y="10" />\n' +
    '        <di:waypoint x="70" y="-10" />\n' +
    '        <di:waypoint x="50" y="-10" />\n' +
    '        <di:waypoint x="50" y="10" />\n' +
    '      </bpmndi:BPMNEdge>\n' +
    '      <bpmndi:BPMNEdge id="Flow_1gu42un_di" bpmnElement="Flow_1gu42un">\n' +
    '        <di:waypoint x="50" y="10" />\n' +
    '        <di:waypoint x="50" y="-10" />\n' +
    '        <di:waypoint x="70" y="-10" />\n' +
    '        <di:waypoint x="70" y="10" />\n' +
    '        <di:waypoint x="50" y="10" />\n' +
    '        <di:waypoint x="50" y="32" />\n' +
    '      </bpmndi:BPMNEdge>\n' +
    '      <bpmndi:BPMNEdge id="Flow_1skraj1_di" bpmnElement="Flow_1skraj1">\n' +
    '        <di:waypoint x="50" y="25" />\n' +
    '        <di:waypoint x="50" y="10" />\n' +
    '        <di:waypoint x="70" y="10" />\n' +
    '        <di:waypoint x="70" y="20" />\n' +
    '        <di:waypoint x="50" y="20" />\n' +
    '        <di:waypoint x="50" y="32" />\n' +
    '      </bpmndi:BPMNEdge>\n' +
    '      <bpmndi:BPMNEdge id="Flow_11l0uo0_di" bpmnElement="Flow_11l0uo0">\n' +
    '        <di:waypoint x="430" y="240" />\n' +
    '        <di:waypoint x="430" y="26" />\n' +
    '        <di:waypoint x="450" y="26" />\n' +
    '        <di:waypoint x="450" y="-52" />\n' +
    '        <di:waypoint x="430" y="-52" />\n' +
    '        <di:waypoint x="430" y="-32" />\n' +
    '      </bpmndi:BPMNEdge>\n' +
    '      <bpmndi:BPMNEdge id="DataInputAssociation_1uuujuu_di" bpmnElement="DataInputAssociation_1uuujuu">\n' +
    '        <di:waypoint x="455" y="360" />\n' +
    '        <di:waypoint x="550" y="360" />\n' +
    '        <di:waypoint x="550" y="298" />\n' +
    '      </bpmndi:BPMNEdge>\n' +
    '      <bpmndi:BPMNEdge id="Flow_0k7wb56_di" bpmnElement="Flow_0k7wb56">\n' +
    '        <di:waypoint x="600" y="258" />\n' +
    '        <di:waypoint x="652" y="258" />\n' +
    '      </bpmndi:BPMNEdge>\n' +
    '    </bpmndi:BPMNPlane>\n' +
    '  </bpmndi:BPMNDiagram>\n' +
    '  <bpmndi:BPMNDiagram id="BPMNDiagram_0y7mvgl">\n' +
    '    <bpmndi:BPMNPlane id="BPMNPlane_1hcq5fl" bpmnElement="Activity_087q8te" />\n' +
    '  </bpmndi:BPMNDiagram>\n' +
    '</bpmn2:definitions>\n';

export const validQuantMEDiagram = '<?xml version="1.0" encoding="UTF-8"?> <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:quantme="https://github.com/UST-QuAntiL/QuantME-Quantum4BPMN" id="Definitions_13b49ha" targetNamespace="http://bpmn.io/schema/bpmn" exporter="QuantME Modeler" exporterVersion="4.5.0-nightly.20211129">   <bpmn:process id="analysis-and-rewrite-workflow" isExecutable="true">     <bpmn:startEvent id="StartEvent_1">       <bpmn:extensionElements>         <camunda:formData>           <camunda:formField id="input_url" label="URL to the input data" type="string" />           <camunda:formField id="ibmq_token" label="IBMQ Access Token" type="string" />           <camunda:formField id="ibmq_backend" label="IBMQ Backend" type="string" />         </camunda:formData>       </bpmn:extensionElements>       <bpmn:outgoing>SequenceFlow_0kum1kc</bpmn:outgoing>     </bpmn:startEvent>     <bpmn:sequenceFlow id="SequenceFlow_0kum1kc" sourceRef="StartEvent_1" targetRef="Task_0bysx93" />     <bpmn:serviceTask id="Task_0bysx93" name="Initialize Quantum&#10;K-Means" opentosca:deploymentModelUrl="{{ wineryEndpoint }}/servicetemplates/http%253A%252F%252Fquantil.org%252Fquantme%252Fpull/KMeansInitializerService/?csar">       <bpmn:incoming>SequenceFlow_0kum1kc</bpmn:incoming>       <bpmn:outgoing>SequenceFlow_0gw15u7</bpmn:outgoing>     </bpmn:serviceTask>     <bpmn:sequenceFlow id="SequenceFlow_0gw15u7" sourceRef="Task_0bysx93" targetRef="ExclusiveGateway_1g07eb9" />     <bpmn:exclusiveGateway id="ExclusiveGateway_1g07eb9">       <bpmn:incoming>SequenceFlow_0gw15u7</bpmn:incoming>       <bpmn:incoming>SequenceFlow_00gjpgx</bpmn:incoming>       <bpmn:outgoing>SequenceFlow_0s6m835</bpmn:outgoing>     </bpmn:exclusiveGateway>     <bpmn:sequenceFlow id="SequenceFlow_0s6m835" sourceRef="ExclusiveGateway_1g07eb9" targetRef="Task_0qfiqux" />     <bpmn:sequenceFlow id="SequenceFlow_15qw95r" sourceRef="Task_0qfiqux" targetRef="Task_0lg77kd" />     <bpmn:exclusiveGateway id="ExclusiveGateway_052cifa" name="converged?" camunda:asyncBefore="true">       <bpmn:incoming>SequenceFlow_0fxi83k</bpmn:incoming>       <bpmn:outgoing>SequenceFlow_16yvlag</bpmn:outgoing>       <bpmn:outgoing>SequenceFlow_0591a3g</bpmn:outgoing>     </bpmn:exclusiveGateway>     <bpmn:sequenceFlow id="SequenceFlow_16yvlag" name="No" sourceRef="ExclusiveGateway_052cifa" targetRef="Task_11jwstv">       <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">${clusteringConverged == \'false\'}</bpmn:conditionExpression>     </bpmn:sequenceFlow>     <bpmn:sequenceFlow id="SequenceFlow_00gjpgx" sourceRef="Task_11jwstv" targetRef="ExclusiveGateway_1g07eb9" />     <bpmn:sequenceFlow id="SequenceFlow_0591a3g" name="Yes" sourceRef="ExclusiveGateway_052cifa" targetRef="Task_0ky02vw">       <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">${clusteringConverged == \'true\'}</bpmn:conditionExpression>     </bpmn:sequenceFlow>     <bpmn:exclusiveGateway id="ExclusiveGateway_0jbrct6">       <bpmn:incoming>SequenceFlow_1wsvjv1</bpmn:incoming>       <bpmn:incoming>SequenceFlow_0ncbyt5</bpmn:incoming>       <bpmn:outgoing>SequenceFlow_08ni26o</bpmn:outgoing>     </bpmn:exclusiveGateway>     <bpmn:sequenceFlow id="SequenceFlow_1wsvjv1" sourceRef="Task_0ky02vw" targetRef="ExclusiveGateway_0jbrct6" />     <bpmn:sequenceFlow id="SequenceFlow_08ni26o" sourceRef="ExclusiveGateway_0jbrct6" targetRef="Task_1ptc5xw" />     <bpmn:sequenceFlow id="SequenceFlow_08ed0ea" sourceRef="Task_1ptc5xw" targetRef="Task_1mspa9s" />     <bpmn:exclusiveGateway id="ExclusiveGateway_1pzukzt" name="iterations &#62; 30 &#10;or costs &#60; 0.2" camunda:asyncBefore="true">       <bpmn:incoming>SequenceFlow_09l09is</bpmn:incoming>       <bpmn:outgoing>SequenceFlow_0ncbyt5</bpmn:outgoing>       <bpmn:outgoing>SequenceFlow_0vmb89t</bpmn:outgoing>     </bpmn:exclusiveGateway>     <bpmn:sequenceFlow id="SequenceFlow_09l09is" sourceRef="Task_1mspa9s" targetRef="ExclusiveGateway_1pzukzt" />     <bpmn:sequenceFlow id="SequenceFlow_0ncbyt5" name="No" sourceRef="ExclusiveGateway_1pzukzt" targetRef="ExclusiveGateway_0jbrct6">       <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">${classificationConverged == \'false\'}</bpmn:conditionExpression>     </bpmn:sequenceFlow>     <bpmn:sequenceFlow id="SequenceFlow_0vmb89t" name="Yes" sourceRef="ExclusiveGateway_1pzukzt" targetRef="Task_1vi6pzv">       <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">${classificationConverged == \'true\'}</bpmn:conditionExpression>     </bpmn:sequenceFlow>     <bpmn:sequenceFlow id="SequenceFlow_1csno8e" sourceRef="Task_06q9rh6" targetRef="EndEvent_08sc4da" />     <bpmn:userTask id="Task_06q9rh6" name="Analyze&#10;Results">       <bpmn:extensionElements>         <camunda:formData>           <camunda:formField id="plotUrl" label="Result Image URL" type="string">             <camunda:properties>               <camunda:property id="Property_1mktdna" />             </camunda:properties>             <camunda:validation>               <camunda:constraint name="readonly" />             </camunda:validation>           </camunda:formField>         </camunda:formData>       </bpmn:extensionElements>       <bpmn:incoming>SequenceFlow_03zrxe7</bpmn:incoming>       <bpmn:outgoing>SequenceFlow_1csno8e</bpmn:outgoing>     </bpmn:userTask>     <bpmn:endEvent id="EndEvent_08sc4da">       <bpmn:incoming>SequenceFlow_1csno8e</bpmn:incoming>     </bpmn:endEvent>     <bpmn:sequenceFlow id="SequenceFlow_0fxi83k" sourceRef="Task_0lg77kd" targetRef="ExclusiveGateway_052cifa" />     <bpmn:serviceTask id="Task_0lg77kd" name="Calculate&#10;New&#10;Centroids" quantme:deploymentModelUrl="{{ wineryEndpoint }}/servicetemplates/http%253A%252F%252Fquantil.org%252Fquantme%252Fpull/KMeansConvergenceService/?csar">       <bpmn:incoming>SequenceFlow_15qw95r</bpmn:incoming>       <bpmn:outgoing>SequenceFlow_0fxi83k</bpmn:outgoing>     </bpmn:serviceTask>     <bpmn:serviceTask id="Task_11jwstv" name="Adapt&#10;Quantum&#10;Circuits" quantme:deploymentModelUrl="{{ wineryEndpoint }}/servicetemplates/http%253A%252F%252Fquantil.org%252Fquantme%252Fpull/KMeansAdaptationService/?csar">       <bpmn:incoming>SequenceFlow_16yvlag</bpmn:incoming>       <bpmn:outgoing>SequenceFlow_00gjpgx</bpmn:outgoing>     </bpmn:serviceTask>     <bpmn:serviceTask id="Task_0ky02vw" name="Initialize Quantum&#10;SVM" quantme:deploymentModelUrl="{{ wineryEndpoint }}/servicetemplates/http%253A%252F%252Fquantil.org%252Fquantme%252Fpull/QSVMInitializerService/?csar">       <bpmn:incoming>SequenceFlow_0591a3g</bpmn:incoming>       <bpmn:outgoing>SequenceFlow_1wsvjv1</bpmn:outgoing>     </bpmn:serviceTask>     <bpmn:serviceTask id="Task_1mspa9s" name="Optimize&#10;Thetas" quantme:deploymentModelUrl="{{ wineryEndpoint }}/servicetemplates/http%253A%252F%252Fquantil.org%252Fquantme%252Fpull/QSVMOptimizerService/?csar">       <bpmn:incoming>SequenceFlow_08ed0ea</bpmn:incoming>       <bpmn:outgoing>SequenceFlow_09l09is</bpmn:outgoing>     </bpmn:serviceTask>     <bpmn:sequenceFlow id="SequenceFlow_03zrxe7" sourceRef="Task_1vi6pzv" targetRef="Task_06q9rh6" />     <bpmn:serviceTask id="Task_1vi6pzv" name="Evaluate Classifier" quantme:deploymentModelUrl="{{ wineryEndpoint }}/servicetemplates/http%253A%252F%252Fquantil.org%252Fquantme%252Fpull/EvaluationService/?csar">       <bpmn:incoming>SequenceFlow_0vmb89t</bpmn:incoming>       <bpmn:outgoing>SequenceFlow_03zrxe7</bpmn:outgoing>     </bpmn:serviceTask>     <quantme:quantumCircuitExecutionTask id="Task_1ptc5xw" name="Execute Quantum&#10;Circuit" provider="ibmq" programmingLanguage="qiskit">       <bpmn:incoming>SequenceFlow_08ni26o</bpmn:incoming>       <bpmn:outgoing>SequenceFlow_08ed0ea</bpmn:outgoing>     </quantme:quantumCircuitExecutionTask>     <quantme:quantumCircuitExecutionTask id="Task_0qfiqux" name="Execute Quantum Circuits" provider="ibmq" programmingLanguage="openqasm">       <bpmn:incoming>SequenceFlow_0s6m835</bpmn:incoming>       <bpmn:outgoing>SequenceFlow_15qw95r</bpmn:outgoing>     </quantme:quantumCircuitExecutionTask>   </bpmn:process>   <bpmndi:BPMNDiagram id="BPMNDiagram_1">     <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="analysis-and-rewrite-workflow">       <bpmndi:BPMNEdge id="SequenceFlow_03zrxe7_di" bpmnElement="SequenceFlow_03zrxe7">         <di:waypoint x="1450" y="257" />         <di:waypoint x="1480" y="257" />       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="SequenceFlow_0fxi83k_di" bpmnElement="SequenceFlow_0fxi83k">         <di:waypoint x="650" y="257" />         <di:waypoint x="675" y="257" />       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="SequenceFlow_1csno8e_di" bpmnElement="SequenceFlow_1csno8e">         <di:waypoint x="1580" y="257" />         <di:waypoint x="1602" y="257" />       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="SequenceFlow_0vmb89t_di" bpmnElement="SequenceFlow_0vmb89t">         <di:waypoint x="1305" y="257" />         <di:waypoint x="1350" y="257" />         <bpmndi:BPMNLabel>           <dc:Bounds x="1309" y="239" width="18" height="14" />         </bpmndi:BPMNLabel>       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="SequenceFlow_0ncbyt5_di" bpmnElement="SequenceFlow_0ncbyt5">         <di:waypoint x="1280" y="232" />         <di:waypoint x="1280" y="120" />         <di:waypoint x="940" y="120" />         <di:waypoint x="940" y="232" />         <bpmndi:BPMNLabel>           <dc:Bounds x="1292" y="193" width="15" height="14" />         </bpmndi:BPMNLabel>       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="SequenceFlow_09l09is_di" bpmnElement="SequenceFlow_09l09is">         <di:waypoint x="1220" y="257" />         <di:waypoint x="1255" y="257" />       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="SequenceFlow_08ed0ea_di" bpmnElement="SequenceFlow_08ed0ea">         <di:waypoint x="1090" y="257" />         <di:waypoint x="1120" y="257" />       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="SequenceFlow_08ni26o_di" bpmnElement="SequenceFlow_08ni26o">         <di:waypoint x="965" y="257" />         <di:waypoint x="990" y="257" />       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="SequenceFlow_1wsvjv1_di" bpmnElement="SequenceFlow_1wsvjv1">         <di:waypoint x="880" y="257" />         <di:waypoint x="915" y="257" />       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="SequenceFlow_0591a3g_di" bpmnElement="SequenceFlow_0591a3g">         <di:waypoint x="725" y="257" />         <di:waypoint x="780" y="257" />         <bpmndi:BPMNLabel>           <dc:Bounds x="734" y="239" width="18" height="14" />         </bpmndi:BPMNLabel>       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="SequenceFlow_00gjpgx_di" bpmnElement="SequenceFlow_00gjpgx">         <di:waypoint x="490" y="120" />         <di:waypoint x="370" y="120" />         <di:waypoint x="370" y="232" />       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="SequenceFlow_16yvlag_di" bpmnElement="SequenceFlow_16yvlag">         <di:waypoint x="700" y="232" />         <di:waypoint x="700" y="120" />         <di:waypoint x="590" y="120" />         <bpmndi:BPMNLabel>           <dc:Bounds x="708" y="193" width="15" height="14" />         </bpmndi:BPMNLabel>       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="SequenceFlow_15qw95r_di" bpmnElement="SequenceFlow_15qw95r">         <di:waypoint x="520" y="257" />         <di:waypoint x="550" y="257" />       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="SequenceFlow_0s6m835_di" bpmnElement="SequenceFlow_0s6m835">         <di:waypoint x="395" y="257" />         <di:waypoint x="420" y="257" />       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="SequenceFlow_0gw15u7_di" bpmnElement="SequenceFlow_0gw15u7">         <di:waypoint x="320" y="257" />         <di:waypoint x="345" y="257" />       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="SequenceFlow_0kum1kc_di" bpmnElement="SequenceFlow_0kum1kc">         <di:waypoint x="188" y="257" />         <di:waypoint x="220" y="257" />       </bpmndi:BPMNEdge>       <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">         <dc:Bounds x="152" y="239" width="36" height="36" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="ServiceTask_0jfklh6_di" bpmnElement="Task_0bysx93">         <dc:Bounds x="220" y="217" width="100" height="80" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="ExclusiveGateway_1g07eb9_di" bpmnElement="ExclusiveGateway_1g07eb9" isMarkerVisible="true">         <dc:Bounds x="345" y="232" width="50" height="50" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="ExclusiveGateway_052cifa_di" bpmnElement="ExclusiveGateway_052cifa" isMarkerVisible="true">         <dc:Bounds x="675" y="232" width="50" height="50" />         <bpmndi:BPMNLabel>           <dc:Bounds x="671" y="289" width="58" height="14" />         </bpmndi:BPMNLabel>       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="ExclusiveGateway_0jbrct6_di" bpmnElement="ExclusiveGateway_0jbrct6" isMarkerVisible="true">         <dc:Bounds x="915" y="232" width="50" height="50" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="ExclusiveGateway_1pzukzt_di" bpmnElement="ExclusiveGateway_1pzukzt" isMarkerVisible="true">         <dc:Bounds x="1255" y="232" width="50" height="50" />         <bpmndi:BPMNLabel>           <dc:Bounds x="1244" y="289" width="73" height="27" />         </bpmndi:BPMNLabel>       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="UserTask_1dg3wae_di" bpmnElement="Task_06q9rh6">         <dc:Bounds x="1480" y="217" width="100" height="80" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="EndEvent_1ruqffc_di" bpmnElement="EndEvent_08sc4da">         <dc:Bounds x="1602" y="239" width="36" height="36" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="ServiceTask_1hpv5f5_di" bpmnElement="Task_0lg77kd">         <dc:Bounds x="550" y="217" width="100" height="80" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="ServiceTask_1igyi96_di" bpmnElement="Task_11jwstv">         <dc:Bounds x="490" y="80" width="100" height="80" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="ServiceTask_07lly8e_di" bpmnElement="Task_0ky02vw">         <dc:Bounds x="780" y="217" width="100" height="80" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="ServiceTask_093318x_di" bpmnElement="Task_1mspa9s">         <dc:Bounds x="1120" y="217" width="100" height="80" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="ServiceTask_1hkb4uw_di" bpmnElement="Task_1vi6pzv">         <dc:Bounds x="1350" y="217" width="100" height="80" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="QuantumCircuitExecutionTask_123wxlx_di" bpmnElement="Task_1ptc5xw">         <dc:Bounds x="990" y="217" width="100" height="80" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="QuantumCircuitExecutionTask_0ola47b_di" bpmnElement="Task_0qfiqux">         <dc:Bounds x="420" y="217" width="100" height="80" />       </bpmndi:BPMNShape>     </bpmndi:BPMNPlane>   </bpmndi:BPMNDiagram> </bpmn:definitions>';

export const validDataFlowDiagram = '<?xml version="1.0" encoding="UTF-8"?> <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dataflow="https://github.com/data/transformation" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">   <bpmn2:process id="Process_1" isExecutable="false">     <dataflow:inputTransformationAssociation id="InputTransformationAssociation_0gvnskb" sourceRef="DataMapObject_0ivpkki" targetRef="Activity_02r3l26">       <dataflow:keyValueEntry name="input1" value="${4 + 5}" />     </dataflow:inputTransformationAssociation>     <bpmn2:startEvent id="StartEvent_1">       <bpmn2:outgoing>Flow_1wgvxmm</bpmn2:outgoing>     </bpmn2:startEvent>     <bpmn2:sequenceFlow id="Flow_1wgvxmm" sourceRef="StartEvent_1" targetRef="Activity_02r3l26" />     <bpmn2:endEvent id="Event_13yhn2n">       <bpmn2:incoming>Flow_1wr8t0y</bpmn2:incoming>     </bpmn2:endEvent>     <bpmn2:sequenceFlow id="Flow_1wr8t0y" sourceRef="Activity_02r3l26" targetRef="Event_13yhn2n" />     <dataflow:transformationTask id="Activity_02r3l26">       <bpmn2:incoming>Flow_1wgvxmm</bpmn2:incoming>       <bpmn2:outgoing>Flow_1wr8t0y</bpmn2:outgoing>       <bpmn2:property id="Property_0ohays4" name="__targetRef_placeholder" />       <bpmn2:dataInputAssociation id="DataInputAssociation_0hhmbnf">         <bpmn2:sourceRef>DataStoreMap_0louwgh</bpmn2:sourceRef>         <bpmn2:targetRef>Property_0ohays4</bpmn2:targetRef>       </bpmn2:dataInputAssociation>       <bpmn2:dataOutputAssociation id="DataOutputAssociation_0wn9bp1">         <bpmn2:targetRef>DataMapObject_19we4h2</bpmn2:targetRef>       </bpmn2:dataOutputAssociation>       <dataflow:keyValueEntry name="Const" value="56" />     </dataflow:transformationTask>     <dataflow:dataStoreMap id="DataStoreMap_0louwgh" />     <dataflow:dataMapObject id="DataMapObject_0ivpkki" dataObjectRef="DataObject_0gep2or" />     <bpmn2:dataObject id="DataObject_0gep2or" />     <dataflow:dataMapObject id="DataMapObject_19we4h2" dataObjectRef="DataObject_030aew8">       <dataflow:keyValueEntry name="Name" />       <dataflow:keyValueEntry name="Age" value="" />     </dataflow:dataMapObject>     <bpmn2:dataObject id="DataObject_030aew8" />   </bpmn2:process>   <bpmndi:BPMNDiagram id="BPMNDiagram_1">     <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">       <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">         <dc:Bounds x="412" y="240" width="36" height="36" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="Event_13yhn2n_di" bpmnElement="Event_13yhn2n">         <dc:Bounds x="652" y="240" width="36" height="36" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="Activity_19d7wkp_di" bpmnElement="Activity_02r3l26">         <dc:Bounds x="500" y="218" width="100" height="80" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="DataStoreMap_0louwgh_di" bpmnElement="DataStoreMap_0louwgh">         <dc:Bounds x="405" y="325" width="50" height="50" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="DataMapObject_0ivpkki_di" bpmnElement="DataMapObject_0ivpkki">         <dc:Bounds x="412" y="105" width="36" height="50" />       </bpmndi:BPMNShape>       <bpmndi:BPMNShape id="DataMapObject_19we4h2_di" bpmnElement="DataMapObject_19we4h2">         <dc:Bounds x="652" y="105" width="36" height="50" />       </bpmndi:BPMNShape>       <bpmndi:BPMNEdge id="InputTransformationAssociation_0gvnskb_di" bpmnElement="InputTransformationAssociation_0gvnskb">         <di:waypoint x="448" y="130" />         <di:waypoint x="550" y="130" />         <di:waypoint x="550" y="218" />       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="Flow_1wgvxmm_di" bpmnElement="Flow_1wgvxmm">         <di:waypoint x="448" y="258" />         <di:waypoint x="500" y="258" />       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="Flow_1wr8t0y_di" bpmnElement="Flow_1wr8t0y">         <di:waypoint x="600" y="258" />         <di:waypoint x="652" y="258" />       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="DataInputAssociation_0hhmbnf_di" bpmnElement="DataInputAssociation_0hhmbnf">         <di:waypoint x="455" y="350" />         <di:waypoint x="550" y="350" />         <di:waypoint x="550" y="298" />       </bpmndi:BPMNEdge>       <bpmndi:BPMNEdge id="DataOutputAssociation_0wn9bp1_di" bpmnElement="DataOutputAssociation_0wn9bp1">         <di:waypoint x="570" y="210" />         <di:waypoint x="570" y="125" />         <di:waypoint x="652" y="125" />       </bpmndi:BPMNEdge>     </bpmndi:BPMNPlane>   </bpmndi:BPMNDiagram> </bpmn2:definitions> ';

export {validPlanqkDiagram, transformedValidPlanqkDiagram};