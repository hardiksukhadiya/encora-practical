require('rootpath')(); 
require('configs/commonModule'); // load global modules
const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const errorHandler = require('middleware/error-handler');
const swaggerUi = require('swagger-ui-express');
const port = generalConfig.SERVERPORT ? (generalConfig.SERVERPORT) : 4000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors()); // enable cross origin request

// add api routes
app.use('/users', require('api/users/user.controller'));
app.use('/notes', require('api/notes/note.controller'));

/**
 * Swagger definition start
 */
var options = {
    customCss: '.swagger-ui .models { display: none }',
    swaggerOptions: {
        docExpansion: 'none'
    }
};
let mainSwaggerData = JSON.parse(fs.readFileSync('swagger.json'));
mainSwaggerData.host = "localhost:"+port;

const modules = './api/';
fs.readdirSync(modules).forEach(file => {
    if (fs.existsSync(modules + '/' + file + '/swagger.json')) {
        const stats = fs.statSync(modules + '/' + file + '/swagger.json');
        const fileSizeInBytes = stats.size;
        if (fileSizeInBytes) {
            let swaggerData = fs.readFileSync(modules + '/' + file + '/swagger.json');
            swaggerData = swaggerData ? JSON.parse(swaggerData) : { paths: {}, definitions: {} };
            mainSwaggerData.paths = { ...swaggerData.paths, ...mainSwaggerData.paths };
            mainSwaggerData.definitions = { ...swaggerData.definitions, ...mainSwaggerData.definitions };
        }
    }
});
let swaggerDocument = mainSwaggerData;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
/**
 * Swagger definition ends
 */

// global error handler
app.use(errorHandler);

// start server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
