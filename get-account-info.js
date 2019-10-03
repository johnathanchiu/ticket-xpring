'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // TestNet Server
});
api.connect().then(() => {
  /* begin custom code ------------------------------------ */
  const myAddress = 'rfsKBo76aVrT3jCTeg1zJjm9gmcUY9NK3q';

  console.log('getting account info for', myAddress);
  return api.getAccountInfo(myAddress);

}).then(info => {
  console.log(info);
  console.log('getAccountInfo done');

  /* end custom code -------------------------------------- */
}).then(() => {
  return api.disconnect();
}).then(() => {
  console.log('done and disconnected.');
}).catch(console.error);
