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
            title: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.STRING, allowNull: false },
        };

    return sequelize.define('UserNotes', attributes, {});

};
