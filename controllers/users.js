const express = require('express');
const bcrypt = require('bcrypt')
const usersRouter = express.Router()
const { User, Blog } = require('../models');
const { userFinder } = require('../utils/middleware');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../utils/config');


usersRouter.get('/', async (request, response) => {
  const users = await User.findAll({
    include: {
      model: Blog
    }
  });
  response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (!body.password || body.password.length < 3) {
    return response.status(401).json({ error: 'Password minimun length is 3' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)
  try {
    const userObject = await User.create({
      passwordHash,
      username: body.username,
      name: body.name
    });
    response.json(userObject.toJSON())

  } catch (error) {
    next(error)
  }
})

const singleUserRouter = express.Router();

singleUserRouter.get('/', async (request, response) => {
  const dbUser = request.user;
  response.json(dbUser.toJSON())
})

singleUserRouter.put('/', async (request, response, next) => {
  const body = request.body
  const dbUser = request.user;
  const decodedToken = jwt.verify(request.token, SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (decodedToken.id !== dbUser.id) {
    return response.status(401).json({ error: 'Only user itself can modify their information' });

  }
  try {
    const updated = await dbUser.update(body);
    response.json(updated.toJSON()).status(204).end()

  } catch (error) {
    next(error)
  }
})

singleUserRouter.delete('/', async (request, response) => {

  const dbUser = request.user;

  await dbUser.destroy()
  response.status(204).end();
})


usersRouter.use('/:id', userFinder, singleUserRouter)

module.exports = usersRouter