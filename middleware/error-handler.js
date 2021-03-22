module.exports = errorHandler;

/**
 * Global error handler
 * @param  {obj}   req
 * @param  {obj}   res
 * @param  {Function} next
 * @return json for fail or success notification
 * */
function errorHandler(err, req, res, next) {
    switch (true) {
        case typeof err === 'string':
            // custom application error
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({ message: err });
        case err.name === 'UnauthorizedError':
            // jwt authentication error
            return res.status(401).json({ message: 'Unauthorized' });
        default:
            return res.status(500).json({ message: err.message });
    }
}
