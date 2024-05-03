// contractService.js
const { Op, sequelize } = require('sequelize');
const { Contract } = require('../model');

const getContractById = async (id) => {
    return await Contract.findByPk(id, { include: ['Client', 'Contractor'] });
};

const getContractsForProfile = async (profileId) => {
    return await Contract.findAll({
        where: {
            [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
            status: { [Op.ne]: 'terminated' },
        },
    });
};

module.exports = {
    getContractById,
    getContractsForProfile,
};
