/****************************
 Configuration
 ****************************/
// For environment variables [will work with .env file]
require('custom-env').env('dev')
//require('custom-env').env('staging')
// require('custom-env').env('production')

let ENV_VARIABLES = process.env;

module.exports = {
    ...ENV_VARIABLES,
};