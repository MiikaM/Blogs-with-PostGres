const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const { User, WebToken } = require('../models')
const { SECRET } = require('../utils/config');

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ where: { username: body.username, disabled: false } })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET, { expiresIn: '1m' })

  await WebToken.create({
    userId: user.id,
    token
  })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter