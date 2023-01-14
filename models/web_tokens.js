// const mongoose = require('mongoose')
require('dotenv').config()
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');


class WebToken extends Model { }

WebToken.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        underscored: true,
        timestamps: false,
        modelName: 'WebToken'
    })

module.exports = WebToken