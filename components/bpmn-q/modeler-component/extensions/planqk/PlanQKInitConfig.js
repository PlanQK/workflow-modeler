// import {getActivePlugins} from "../../editor/plugin/PluginHandler";

export function subscriptions() {

    // return getPluginConfig('planqk').subscriptions;
}

export function oauthInfo() {
    return new Map([
        ['app1', {consumerKey: 'app1ConsumerKey', consumerSecret: 'app1ConsumerSecret'}],
        ['app2', {consumerKey: 'app2ConsumerKey', consumerSecret: 'app2ConsumerSecret'}]
    ]);
}

export function dataPools() {
    const dp1 = {
        name: 'Anomaly Detection: Bars & Stipes Dataset ',
        id: '2a7d74a6-0fb5-400a-8f0c-7125aef5613e',
        link: 'https://platform.planqk.de/datapools/2a7d74a6-0fb5-400a-8f0c-7125aef5613e/',
        description: 'A synthetic dataset for the anomaly detection. There are two version of the dataset, a larger version consisting of 3x3 pixel images of bars and stripes and a small version of 2x2 pixel images. We provide pretrained models for both of these datasets to be used with the AnoGan service.',
    };
    const dp2 = {
        name: 'Infinite Data Pool',
        id: '2a7d74a6-0fb5-400a-asd3-7125aef5613e',
        link: 'https://platform.planqk.de/datapools/2a7d74a6-0fb5-400a-asd3-7125aef5613e/',
        description: 'A dataset with an infinite amount of data to train endless models.',
    };
    const dp3 = {
        name: 'Small Data Pool',
        id: '2a7d74a6-adsa-400a-8f0c-7125aef5613e',
        link: 'https://platform.planqk.de/datapools/2a7d74a6-adsa-400a-8f0c-7125aef5613e/',
        description: 'Replace this by a real description',
    };
    return [dp1, dp2, dp3];
}
