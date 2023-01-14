const express = require('express');
const bcrypt = require('bcrypt')
const usersRouter = express.Router()
const { User, Blog, WebToken } = require('../models');
const { userFinder, checkToken } = require('../utils/middleware');

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

singleUserRouter.put('/', checkToken, async (request, response, next) => {
  const body = request.body
  const dbUser = request.user;
  const token = request.token;

  if (token.id !== dbUser.id) {
    return response.status(401).json({ error: 'Only user itself can modify their information' });

  }
  try {
    const updated = await dbUser.update(body);
    response.json(updated.toJSON()).status(204).end()

  } catch (error) {
    next(error)
  }
})

singleUserRouter.delete('/', checkToken, async (request, response) => {

  const dbUser = request.user;
  const token = request.token;

  await dbUser.update({ disabled: true })
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
    return response.status(500).json({ error: "Server failure" });
  }

  response.status(204).end();
})


usersRouter.use('/:id', userFinder, singleUserRouter)

module.exports = usersRouter