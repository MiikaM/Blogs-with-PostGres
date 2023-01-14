const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readingListsRouter = require('./controllers/readingListsRouter')

app.use(cors())
app.use(express.json())
app.use(middleware.morg)
app.use(middleware.tokenExtractor)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readingLists', readingListsRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app