// import Application, {OAuthInfo} from "@/model/Application";

export function subscriptions() {

  const app1 = {
    id: 'app1',
    description: '',
    attributes: null,
    groups: [],
    name: 'Seppones App',
    subscriptionCount: 2
  };
  const api1 = {
    id: 'api1',
    name: 'Seppones API',
    gatewayEndpoint: 'www.seppone-gateway.de/api1',
    version: 'v1',
    context: '/api1'
  };
  const api2 = {
    id: 'api2',
    name: 'Felixs API',
    gatewayEndpoint: 'www.felix-gateway.de/api1',
    version: 'v1',
    context: '/api1'
  };
  const sub1 = {id: 'sub1', application: app1, api: api1};
  const sub2 = {id: 'sub2', application: app1, api: api2};
  const app2 = {
    id: 'app2',
    description: '',
    attributes: null,
    groups: [],
    name: 'Falkis App',
    subscriptionCount: 1
  };
  const api3 = {
    id: 'api3',
    name: 'Wuddis API',
    gatewayEndpoint: 'www.wuddi-gateway.de/api1',
    version: 'v1',
    context: '/api3'
  };
  const sub3 = {id: 'sub3', application: app2, api: api3};
  return [sub1, sub2, sub3];
}

export function oauthInfo() {
  return new Map([
    ['app1', {consumerKey: 'app1ConsumerKey', consumerSecret: 'app1ConsumerSecret'}],
    ['app2', {consumerKey: 'app2ConsumerKey', consumerSecret: 'app2ConsumerSecret'}]
  ]);
}
