'use strict';

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';
process.env.ALLOW_CONFIG_MUTATIONS = true;
const mongoose = require('mongoose');
const dbConnection = require('../../../api/models/dbConnection');
const tenant = require('../../../api/models/tenant');
const TenantModel = tenant.model;

const createTestTenant = name =>
    tenant
    .create(
      name || 'test',
      {description: [{locale: 'fr', text: 'tenant de test'}]},
      ["test@example.com"]
    )
    .then(tenant =>
      TenantModel.findOneAndUpdate({id: tenant.id}, { $set: { groupRoleMapping: { "all": [ "mng", "snd", "usr" ] } } }, { new: true })
    );


module.exports = {
  createTestTenant,
  createDisbaledTestTenant: () => createTestTenant().then(tenant => tenant.update({ $set: { enable: false } }))
};

beforeEach(done => {

  const clearDB = () => {
    for (let i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(() => {});
    }
  };

  dbConnection.checkDB()
    .then(() => { clearDB(); done(); })
    .catch(err => { console.error(`test db connection error: (${err.name}) ${err.message}`); done(); });
});


afterEach(done => {
  mongoose.disconnect();
  done();
});