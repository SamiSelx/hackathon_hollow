const { body, validationResult } = require('express-validator');
const { constants } = require('../constants');


const validateCharacter = [
  body('name').notEmpty().withMessage('Name is required'),
  body('class').notEmpty().withMessage('Class is required'),
  body('level').isInt({ min: 1 }).withMessage('Level must be a positive integer greater than or equal to 1'),
  body('skills').isArray().withMessage('Skills must be an array'),
  body('inventory').isArray().withMessage('Inventory must be an array'),
  body('health').isInt({ min: 0 }).withMessage('Health must be a non-negative integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(constants.VALIDATION_ERROR);
      return next(new Error(errors.array().map(err => err.msg).join(', ')));
    }
    next();
  }
];

module.exports = { validateCharacter };
