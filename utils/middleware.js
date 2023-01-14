const morgan = require('morgan')
const { Blog, User, UserReadings, WebToken } = require('../models')
const logger = require('./logger')
const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');

morgan.token('contents', function (req) {
  return JSON.stringify(req.body)
})

//Logs the request info
const morg = morgan(':method :url :status :res[content-length] - :response-time ms :contents')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown blog' })
}

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  logger.error(error.message)

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

const checkToken = async (request, response, next) => {
  if (!request.token)
    return response.status(401).json({ error: 'token missing or invalid' })

  const authorizationToken = request.token;
  const dbToken = await WebToken.findOne({
    where: {
      token: authorizationToken
    }
  })

  if (!dbToken)
    return response.status(401).json({ error: 'token missing or invalid' })


  const user = await User.findByPk(dbToken.userId);
  try {
    if (!user || user.disabled) {
      await dbToken.destroy({ force: true })
      const error = { name: "JsonWebTokenError" }
      next(error)
    }
  } catch (error) {
    next(error)
  }

  try {
    const decoded = jwt.verify(authorizationToken, SECRET);
    request.token = decoded;

  } catch (error) {
    await dbToken.destroy({ force: true })
    next(error);
  }

  next()
}

async function blogFinder(request, response, next) {

  try {
    request.blog = await Blog.findByPk(request.params.id)
    if (!request.blog) return response.sendStatus(404)
  } catch (error) {
    next(error)
  }

  next()
}

async function userFinder(request, response, next) {

  try {
    const where = {};

    if (request.query.read) {
      where.read = (request.query.read === 'true') ? true : false
    }

    const includeDisabledWhere = {
      username: request.params.id,
    }

    if (request.query.read) {
      includeDisabledWhere.disa = (request.query.read === 'true') ? true : false
    }


    request.user = await User.findOne({
      where: {
        username: request.params.id,
      },
      include: [{
        model: Blog,
        as: 'readings',
        through: {
          attributes: ['read', 'id'],
          where
        },
        // where: {
        //   userReadings: { read: true }
        // }
      }]
    })
    if (!request.user) return response.sendStatus(404)
  } catch (error) {
    next(error)
  }

  next()
}

async function readingListFinder(request, response, next) {

  try {
    request.readingList = await UserReadings.findByPk(request.params.id);
    if (!request.readingList) return response.sendStatus(404)
  } catch (error) {
    next(error)
  }

  next()
}


module.exports = {
  morg,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  checkToken,
  blogFinder,
  userFinder,
  readingListFinder
}
