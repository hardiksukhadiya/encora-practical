const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('middleware/validate-request');
const authorize = require('middleware/authorize')
const noteService = require('./note.service');

// routes
router.get('/', authorize(), getAll);
router.post('/create', authorize(), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/delete/:id', authorize(), _delete);
router.get('/get/:id', authorize(), getById);

module.exports = router;

/**
 * Validate scehma for a note
 * @param  {obj}   req
 * @param  {obj}   res
 * @param  {Function} next
 * @return json for fail or success notification
 * */
function createSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}


/**
 * Create a note
 * @param  {obj}   req
 * @param  {obj}   res
 * @param  {Function} next
 * @return json for fail or success notification
 * */
function create(req, res, next) {
    noteService.create(req.body, req.user)
        .then(() => res.json({ message: 'Note created successful' }))
        .catch(next);
}


/**
 * Get all notes with pagination and sorting
 * @param  {obj}   req
 * @param  {obj}   res
 * @param  {Function} next
 * @return json for fail or success notification
 * */

function getAll(req, res, next) {
    noteService.getAll(req.query, req.user)
        .then(users => res.json({
            'data': users,
        }))
        .catch(next);
}

/**
 * Get note by ID and current user only
 * @param  {obj}   req
 * @param  {obj}   res
 * @param  {Function} next
 * @return json for fail or success notification
 * */
function getById(req, res, next) {
    noteService.getById(req.params.id, req.user)
        .then(user => res.json(user))
        .catch(next);
}

/**
 * Validation scema for update note
 * @param  {obj}   req
 * @param  {obj}   res
 * @param  {Function} next
 * @return json for fail or success notification
 * */
function updateSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

/**
 * Update a note
 * @param  {obj}   req
 * @param  {obj}   res
 * @param  {Function} next
 * @return json for fail or success notification
 * */
function update(req, res, next) {
    noteService.update(req.params.id, req.body, req.user)
        .then(user => res.json(user))
        .catch(next);
}

/**
 * Delete a note
 * @param  {obj}   req
 * @param  {obj}   res
 * @param  {Function} next
 * @return json for fail or success notification
 * */
function _delete(req, res, next) {
    noteService.delete(req.params.id, req.user)
        .then(() => res.json({ message: 'Note deleted successfully' }))
        .catch(next);
}
