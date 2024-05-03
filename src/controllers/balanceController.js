const balanceService = require('../services/balanceService');

async function depositMoney(req, res) {
    try {
        const updatedProfile = await balanceService.depositMoney(req.profile.id, req.body.amount);
        res.json(updatedProfile);
    } catch (error) {
        console.error("Error depositing money:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    depositMoney
};
