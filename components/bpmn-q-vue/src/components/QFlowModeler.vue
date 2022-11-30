
<script setup>
    // import '../../../bpmn-q/modeler-component/QuantumWorkflowModeler.js'
    import '../../../bpmn-q/public/app.js'
1
    const props = defineProps({
        test: {
            type: String,
            required: true
        }
    })
</script>
<script>
    export default {
        name: "QFlowModeler"
    }
</script>

<template>
<!--    <q-flow-modeler></q-flow-modeler>-->

        <quantum-workflow style="height: 100%; width: 100%" :name="props.test"></quantum-workflow>
<!--    <link rel="stylesheet" href="../../node_modules/bpmn-js/dist/assets/diagram-js.css" />-->
<!--    <link rel="stylesheet" href="../../node_modules/bpmn-js/dist/assets/bpmn-font/css/bpmn.css" />-->
</template>
