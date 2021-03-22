const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('middleware/validate-request');
const authorize = require('middleware/authorize')
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/', authorize(), getCurrent);
router.get('/current', authorize(), getCurrent);

module.exports = router;

/**
 * Validate authenticate schema
 * @param  {obj}   req
 * @param  {obj}   res
 * @param  {Function} next
 * @return json for fail or success notification
 * */
function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

/**
 * User Authentication
 * @param  {obj}   req
 * @param  {obj}   res
 * @param  {Function} next
 * @return json for fail or success notification
 * */
function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

/**
 * Validation schema for registration
 * @param  {obj}   req
 * @param  {obj}   res
 * @param  {Function} next
 * @return json for fail or success notification
 * */
function registerSchema(req, res, next) {
    const schema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})')).required().messages({
            'string.empty': `"Password" cannot be an empty field`,
            'string.pattern.base': `"Password" Must contains atleast 6 characters and combinations of Small letter, captial letter, digits and one special character`,
        })

    });
    validateRequest(req, next, schema);
}

/**
 * User register
 * @param  {obj}   req
 * @param  {obj}   res
 * @param  {Function} next
 * @return json for fail or success notification
 * */
function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

/**
 * Get currentr user
 * @param  {obj}   req
 * @param  {obj}   res
 * @param  {Function} next
 * @return json for fail or success notification
 * */
function getCurrent(req, res, next) {
    res.json(req.user);
}

