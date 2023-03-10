const express = require('express');
const blogsRouter = express.Router()
const { Blog, User } = require('../models');
const { blogFinder, checkToken } = require('../utils/middleware');
const { Op } = require('sequelize');


blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    order: [
      ['likes', 'DESC']
    ],
    where: {
      [Op.or]: [{
        title: {
          [Op.substring]: request.query.search ? request.query.search : ""
        }
      },
      {
        author: {
          [Op.substring]: request.query.search ? request.query.search : ""
        }
      }]
    }
  });
  response.json(blogs)
})


blogsRouter.post('/', checkToken, async (request, response, next) => {
  const body = request.body;
  const token = request.token;

  try {
    const user = await User.findByPk(token.id)

    const blog = await Blog.create({ ...body, likes: 0, userId: user.id });
    response.status(201).json(blog.toJSON())

  } catch (error) {
    next(error)
  }
})

// Single id routes
const singleBlogRouter = express.Router();

singleBlogRouter.get('/', async (request, response) => {
  const dbBlog = request.blog;
  response.json(dbBlog.toJSON())
})

singleBlogRouter.put('/', checkToken, async (request, response, next) => {
  const body = request.body
  const dbBlog = request.blog;
  try {
    const updated = await dbBlog.update(body);
    response.json(updated.toJSON()).status(204).end()

  } catch (error) {
    next(error)
  }
})

singleBlogRouter.delete('/', checkToken, async (request, response) => {
  const dbBlog = request.blog;
  const token = request.token;

  const user = await User.findByPk(token.id);

  if (dbBlog.user) {
    if (!(dbBlog.userId === user.id)) {
      return response.status(401).json({ error: 'Wrong user' })
    }
  }

  await dbBlog.destroy()
  response.status(204).end();
})

blogsRouter.use('/:id', blogFinder, singleBlogRouter);

module.exports = blogsRouter