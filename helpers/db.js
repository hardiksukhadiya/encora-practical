const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};
/**
 * DB initialize
 * connect to mysql and check if db is not created then will create it
 */
initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { DBHOST, DBPORT, DBUSER, DBPASSWORD, DBNAME } = generalConfig;
    const connection = await mysql.createConnection({ host:DBHOST, port:DBPORT, user:DBUSER, password:DBPASSWORD });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DBNAME}\`;`);

    // connect to db
    const sequelize = new Sequelize(DBNAME, DBUSER, DBPASSWORD, {
        host: DBHOST,
        port: DBPORT,
        dialect: 'mysql'
    });

    // init models and add them to the exported db object
    db.User = require('api/users/user.model')(sequelize);
    db.UserNotes = require('api/notes/note.model')(sequelize);


    // define relationships
    db.User.hasMany(db.UserNotes, { onDelete: 'CASCADE' });
    db.UserNotes.belongsTo(db.User);

    // sync all models with database
    await sequelize.sync();
}
