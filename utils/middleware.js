const morgan = require('morgan')
const { Blog, User, UserReadings } = require('../models')
const logger = require('./logger')

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
    const where = {  };

    if (request.query.read) {
      where.read = (request.query.read === 'true') ? true : false
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
  blogFinder,
  userFinder,
  readingListFinder
}
