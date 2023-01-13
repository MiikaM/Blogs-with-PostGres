const express = require('express');
const blogsRouter = express.Router()
const { Blog, User } = require('../models');
const { blogFinder } = require('../utils/middleware');
const { SECRET } = require('../utils/config')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.findAll({
    attributes: {exclude: ['userId']},
    include: {
      model: User,
      attributes: ['name']
    }
  });
  response.json(blogs)
})


blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  try {
    const user = await User.findByPk(decodedToken.id)

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

singleBlogRouter.put('/', async (request, response, next) => {
  const body = request.body
  const dbBlog = request.blog;
  try {
    const updated = await dbBlog.update(body);
    response.json(updated.toJSON()).status(204).end()

  } catch (error) {
    next(error)
  }
})

singleBlogRouter.delete('/', async (request, response) => {
  const dbBlog = request.blog;

  const decodedToken = jwt.verify(request.token, SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findByPk(decodedToken.id);

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