const { DataTypes } = require('sequelize');
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('web_tokens', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
            }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('web_tokens');
    }
}