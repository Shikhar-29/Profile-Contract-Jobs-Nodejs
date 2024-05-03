const { getBestProfession, getBestClients } = require('../services/adminService');

exports.getBestProfession = async (req, res) => {
    try {
        const { start, end } = req.query;
        const result = await getBestProfession(start, end);
        res.json(result);
    } catch (error) {
        console.error("Error retrieving best profession:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getBestClients = async (req, res) => {
    try {
        const { start, end, limit } = req.query;
        const result = await getBestClients(start, end, limit);
        res.json(result);
    } catch (error) {
        console.error("Error retrieving top clients:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
