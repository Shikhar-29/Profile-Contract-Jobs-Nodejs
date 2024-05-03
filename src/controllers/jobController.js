const { Op } = require('sequelize');
const jobService = require('../services/jobService');

async function getUnpaidJobs(req, res) {
    try {
        const jobs = await jobService.getUnpaidJobs(req.profile.id);
        res.json(jobs);
    } catch (error) {
        console.error("Error retrieving jobs:", error);
        res.status(500).json(error.message);
    }
}

async function payJob(req, res) {
    try {
        await jobService.payJob(req.params.job_id, req.profile);
        res.json({ message: "Payment successful" });
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json(error.message);
    }
}

module.exports = {
    getUnpaidJobs,
    payJob
};
