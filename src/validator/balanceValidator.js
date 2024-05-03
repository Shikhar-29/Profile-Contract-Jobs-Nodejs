exports.validateBalanceParams = (req, res, next) => {
    const { amount } = req.body.amount;
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Invalid Amount" });
    }
    next();
};