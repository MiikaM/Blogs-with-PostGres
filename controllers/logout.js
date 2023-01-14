const logoutRouter = require('express').Router()
const { WebToken } = require('../models');
const { checkToken } = require('../utils/middleware');

logoutRouter.post('/', checkToken, async (request, response) => {
    const token = request.token

    if (!token)
        return response.status(400).json({ error: 'Can\'t log out. No token.' });


    const dbToken = await WebToken.findAll({
        where: {
            userId: token.id
        }
    })

    try {
        dbToken.forEach(async (token) => {
            await token.destroy({ force: true })
        });
    } catch (error) {
        return response.status(500).json({ error: "Server failed to logout" });
    }


    response
        .status(200).send("You have logged out.")
})

module.exports = logoutRouter