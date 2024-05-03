const { Op, sequelize } = require('sequelize');
const { Profile, Job, Contract } = require('../model');

async function depositMoney(userId, amount) {
    const profile = await Profile.findByPk(userId);

    if (!profile) {
        throw new Error("Profile not found");
    }

    const totalJobsToPay = await Job.sum('price', {
        where: {
            '$Contract.ClientId$': profile.id,
            paid: false
        },
        include: [{ model: Contract, as: 'Contract' }]
    });

    const maxDepositAllowed = totalJobsToPay * 0.25;

    if (amount > maxDepositAllowed) {
        throw new Error("Deposit amount exceeds maximum allowed");
    }

    const updatedProfile = await Profile.update(
        { balance: sequelize.literal(`balance + ${amount}`) },
        { where: { id: userId }, returning: true }
    );

    return updatedProfile[1][0];
}

module.exports = {
    depositMoney
};
