// contractValidator.js
const { body, param, validationResult } = require('express-validator');

const validateContractId = param('id').isInt().withMessage('Contract ID must be an integer');

const validateCreateContract = [
    body('clientId').isInt().withMessage('Client ID must be an integer'),
    body('contractorId').isInt().withMessage('Contractor ID must be an integer'),
    body('status').isIn(['pending', 'active', 'terminated']).withMessage('Invalid contract status'),
];

const validateUpdateContract = [
    body('status').isIn(['pending', 'active', 'terminated']).withMessage('Invalid contract status'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({ errors: errors.array() });
};

module.exports = {
    validateContractId,
    validateCreateContract,
    validateUpdateContract,
    validate,
};
