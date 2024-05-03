const { Op } = require('sequelize');
const { sequelize, Job, Profile, Contract } = require('../model');

async function getUnpaidJobs(profileId) {
    return await Job.findAll({
        where: {
            ContractId: {
                [Op.eq]: profileId
            },
            paid: {
                [Op.eq]: null
            }
        }
    });
}

async function payJob(jobId, profile) {
    const job = await Job.findByPk(jobId, { include: Contract });

    if (!job) {
        throw new Error("Job not found");
    }

    if (job.Contract.ClientId !== profile.id) {
        throw new Error("Unauthorized");
    }

    if (job.Contract.status === 'terminated') {
        throw new Error("Contract is already terminated");
    }

    if (job.paid) {
        throw new Error("Job already paid");
    }

    if (profile.balance < job.price) {
        throw new Error("Insufficient balance");
    }

    await sequelize.transaction(async (t) => {
        await Profile.update(
            { balance: sequelize.literal(`balance - ${job.price}`) },
            { where: { id: profile.id }, transaction: t }
        );

        await Profile.update(
            { balance: sequelize.literal(`balance + ${job.price}`) },
            { where: { id: job.Contract.ContractorId }, transaction: t }
        );

        await job.update({ paid: true, paymentDate: new Date() }, { transaction: t });
    });
}

module.exports = {
    getUnpaidJobs,
    payJob
};
