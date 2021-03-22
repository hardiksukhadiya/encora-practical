const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    // define user schema here
    const attributes = {
           id: {
                type: DataTypes.STRING,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            email: { type: DataTypes.STRING, allowNull: false },
            passwordHash: { type: DataTypes.STRING, allowNull: false },
            firstname: { type: DataTypes.STRING, allowNull: false },
            lastname: { type: DataTypes.STRING, allowNull: false },
        };

        const options = {
            defaultScope: {
                // exclude password hash by default
                attributes: { exclude: ['passwordHash'] }
            },
            scopes: {
                // include password hash with this scope
                withHash: { attributes: {}, }
            },        
        }
        
    return sequelize.define('User', attributes, options);

};
