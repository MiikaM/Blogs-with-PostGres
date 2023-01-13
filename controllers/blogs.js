const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// const User = require('../models/user')
// const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  // const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  const blogs = await Blog.findAll();
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findByPk(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!request.token || !decodedToken.id) {
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // }
  // const user = await User.findById(decodedToken.id)
  const blog = await Blog.create(body);

  // user.blogs = user.blogs.concat(savedBlog.id)
  // await user.save()
  response.status(201).json(blog.toJSON())
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  let dbBlog = await Blog.findByPk(request.params.id);

  if (dbBlog) {
    const updated = await dbBlog.update(body);

    response.json(updated.toJSON()).status(204).end()
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  // const blog = await Blog.findById(request.params.id)
  // if (!blog) {
  //   return response.status(400).json({ error: 'Blog has already been removed' })
  // }
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!request.token || !decodedToken.id) {
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // }

  // const user = await User.findById(decodedToken.id)

  // if (blog.user) {
  //   if (!(blog.user.toString() === user._id.toString())) {
  //     return response.status(401).json({ error: 'Wrong user' })
  //   }
  // }
  try {
    const dbBlog = await Blog.findByPk(request.params.id);

    await dbBlog.destroy()

    response.status(204).end();
  } catch (error) {
    response.status(400).json(error.toJSON()).end();

  }

})

module.exports = blogsRouter