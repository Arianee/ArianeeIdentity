const ArianeeIdentity = artifacts.require('ArianeeIdentity');

const validator ='0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
  bouncer = '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1';

module.exports = function(deployer) {
  deployer.deploy(ArianeeIdentity, validator, bouncer);
};
