const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const jobController = require('./controllers/jobController');
const balanceController = require('./controllers/balanceController');
const contractController = require('./controllers/contractController');
const { validate, validateCreateContract, validateUpdateContract } = require('./validator/contractValidator');
const adminController = require('./controllers/adminController');
const adminValidator = require('./validator/adminValidator');
const balanceValidator = require('./validator/balanceValidator');
const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

// Routes
app.get('/contracts/:id', getProfile, contractController.validateContractId, contractController.getContract);
app.get('/contracts', getProfile, contractController.getContracts);
app.get('/jobs/unpaid', getProfile, jobController.getUnpaidJobs);
app.post('/jobs/:job_id/pay', getProfile, jobController.payJob);
app.post('/balances/deposit/:userId', getProfile, balanceValidator.validateBalanceParams, balanceController.depositMoney);
app.get('/admin/best-profession', adminValidator.validateBestProfessionParams, adminController.getBestProfession);
app.get('/admin/best-clients', adminValidator.validateBestClientsParams, adminController.getBestClients);


module.exports = app;
