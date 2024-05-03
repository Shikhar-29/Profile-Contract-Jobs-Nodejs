exports.validateBestProfessionParams = (req, res, next) => {
    const { start, end } = req.query;
    if (!start || !end) {
        return res.status(400).json({ error: "Start and end dates are required." });
    }
    next();
};

exports.validateBestClientsParams = (req, res, next) => {
    const { start, end } = req.query;
    if (!start || !end) {
        return res.status(400).json({ error: "Start and end dates are required." });
    }
    next();
};
