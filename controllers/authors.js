const authorsRouter = require('express').Router()
const { Blog } = require('../models')
const { sequelize } = require('../utils/db');

authorsRouter.get('/', async (request, response) => {

    let authors = await Blog.findAll({
        attributes: [
            'author',
            [sequelize.fn('COUNT', sequelize.col('id')), 'blogs'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
        ],
        order: [
            ['likes', 'DESC']
        ],
        group: "author"
    });

    response
        .status(200)
        .send(authors)
})

module.exports = authorsRouter