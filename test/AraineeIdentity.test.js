const ArianeeIdentity = artifacts.require('ArianeeIdentity');

contract('ArianeeIdentity', (accounts) => {
  let identity;

  beforeEach(async () => {
    identity = await ArianeeIdentity.new(accounts[4], accounts[5]); // bouncer, validator
  });

  it('bouncer should be able to add an identity', async () => {
    identity.addAddressToApprovedList(accounts[1],{from:accounts[4]});

    const isApproved = await identity.addressIsApproved(accounts[1]);
    assert.equal(isApproved, true);
  });

  it('bouncer should be able to remove identity', async()=>{
    identity.addAddressToApprovedList(accounts[1],{from:accounts[4]});

    let isApproved = await identity.addressIsApproved(accounts[1]);
    assert.equal(isApproved, true);

    identity.removeAddressFromApprovedList(accounts[1],{from:accounts[4]});
    isApproved = await identity.addressIsApproved(accounts[1]);
    assert.equal(isApproved, false);
  });

  it('should change the bouncer address', async()=>{
    identity.updateBouncerAddress(accounts[3], {from:accounts[0]});
    identity.addAddressToApprovedList(accounts[1],{from:accounts[3]});
    let isApproved = await identity.addressIsApproved(accounts[1]);
    assert.equal(isApproved, true);
  });

  it('approved address should be able to update his informations', async()=>{
    identity.addAddressToApprovedList(accounts[1],{from:accounts[4]});

    identity.updateInformations('testUri', '0xd0252a864191b4a9c016929c49388e9869f7ebf1decefd90ac8d8052205dabfb',{from:accounts[1]});
    const waitingURI = await identity.waitingURI(accounts[1]);
    const waitingImprint = await identity.waitingImprint(accounts[1]);

    assert.equal(waitingURI, 'testUri');
    assert.equal(waitingImprint, 0xd0252a864191b4a9c016929c49388e9869f7ebf1decefd90ac8d8052205dabfb);
  });

  it('validator should be able to validate informations', async()=>{

    identity.addAddressToApprovedList(accounts[1],{from:accounts[4]});

    identity.updateInformations('testUri', '0xd0252a864191b4a9c016929c49388e9869f7ebf1decefd90ac8d8052205dabfb',{from:accounts[1]});
    identity.validateInformation(accounts[1], 'testUri', '0xd0252a864191b4a9c016929c49388e9869f7ebf1decefd90ac8d8052205dabfb', {from:accounts[5]});

    const waitingURI = await identity.waitingURI(accounts[1]);
    const waitingImprint = await identity.waitingImprint(accounts[1]);

    const addressUri = await identity.addressURI(accounts[1]);
    const addressImprint = await identity.addressImprint(accounts[1]);

    assert.equal(waitingURI, 0x00);
    assert.equal(waitingImprint, 0x00);
    assert.equal(addressUri, 'testUri');
    assert.equal(addressImprint, 0xd0252a864191b4a9c016929c49388e9869f7ebf1decefd90ac8d8052205dabfb);

  });

  it('bouncer should be able to compromise identity', async()=>{
    const date = Math.floor((Date.now())/1000);
    identity.addAddressToApprovedList(accounts[1],{from:accounts[4]});
    identity.updateCompromiseDate(accounts[1], date, {from:accounts[4]});

    const compromiseDate = await identity.compromiseIdentityDate(accounts[1]);
    assert.equal(compromiseDate, date);

  });

});