// const mongoose = require('mongoose')
require('dotenv').config()
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');


class Blog extends Model { }

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
     
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        max: {
          args: parseInt(new Date().getFullYear()),
          msg: "The creation year cannot be larger than the current year."
        },
        min: {
          args: 1991,
          msg: "The creation year cannot be smaller than 1991."
        },
      }
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'blog'
  })

module.exports = Blog