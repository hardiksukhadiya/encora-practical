module.exports = validateRequest;

/**
 * Validation error message
 * @param  {obj}   req
 * @param  {obj}   res
 * @param  {Function} next
 * @return json for fail or success notification
 * */
function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        req.body = value;
        next();
    }
}
