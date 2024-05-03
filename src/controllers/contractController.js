// contractController.js
const { getContractById, getContractsForProfile } = require('../services/contractService');
const { validateContractId } = require('../validator/contractValidator');

const getContract = async (req, res) => {
    const { id } = req.params;
    const { profile } = req;

    try {
        const contract = await getContractById(id);

        if (!contract) {
            return res.status(404).end();
        }

        if (contract.Client.id !== profile.id && contract.Contractor.id !== profile.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        res.json(contract);
    } catch (error) {
        console.error('Error retrieving contract:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getContracts = async (req, res) => {
    const { profile } = req;

    try {
        const contracts = await getContractsForProfile(profile.id);
        res.json(contracts);
    } catch (error) {
        console.error('Error retrieving contracts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getContract,
    getContracts,
    validateContractId,
};
