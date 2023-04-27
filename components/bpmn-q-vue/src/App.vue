<script setup>
import QFlowModeler from './components/QFlowModeler.vue';
</script>

<template>
    <div style="display: flex; height: 100%">
        <div style="width: 15%;"></div>
        <hr/>
        <div style="display: flex; flex-direction: column; height: 100%; width: 85%; flex: 1">
            <h1 style="margin: 10px">Vue BPMN Modeler</h1>
            <div id="button-container" style="display: flex; flex-shrink: 0; height: 60px; background-color: lightgrey">
                <button class="toolbar-btn">Dummy</button>
                <button class="toolbar-btn">Save</button>
                <button class="toolbar-btn">Load</button>
            </div>
            <QFlowModeler/>
            <div style="height: 80px; background-color: lightgrey"></div>
        </div>
    </div>
</template>

<style scoped>
    .toolbar-btn {
        font-size: 18px;
        width: 150px;
        margin: 10px;
    }
</style>
