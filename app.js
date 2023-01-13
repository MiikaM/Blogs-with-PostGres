// const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
// const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
// const mongoose = require('mongoose')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')

app.use(cors())
app.use(express.json())
app.use(middleware.morg)
app.use(middleware.tokenExtractor)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app