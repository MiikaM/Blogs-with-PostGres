const express = require('express');
const blogsRouter = express.Router()
const { Blog } = require('../models');
const { blogFinder } = require('../utils/middleware');
// const User = require('../models/user')
// const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.findAll();
  response.json(blogs.map(blog => blog.toJSON()))
})


blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!request.token || !decodedToken.id) {
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // }
  // const user = await User.findById(decodedToken.id)
  try {
    const blog = await Blog.create(body);
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
  // const blog = await Blog.findByPk(request.params.id)
  // if (!blog) {
  //   return response.status(400).json({ error: 'Blog has already been removed' })
  // }
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!request.token || !decodedToken.id) {
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // }

  // const user = await User.findByPk(decodedToken.id)

  // if (blog.user) {
  //   if (!(blog.user.toString() === user._id.toString())) {
  //     return response.status(401).json({ error: 'Wrong user' })
  //   }
  // }
  const dbBlog = request.blog;

  await dbBlog.destroy()
  response.status(204).end();
})

blogsRouter.use('/:id', blogFinder, singleBlogRouter);

module.exports = blogsRouter