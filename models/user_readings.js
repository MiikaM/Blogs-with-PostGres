const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../utils/db')

class UserReadings extends Model {}

UserReadings.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  blogId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'blogs', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'userReadings'
})

module.exports = UserReadings