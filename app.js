const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const workoutsRouter = require('./controllers/workouts')
const middleware = require('./utils/middleware')
//

logger.info('connecting to', config.MONGODB_URI)

app.use(cors())
app.use(express.json())

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(middleware.requestLogger)
//
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use(express.static('dist'))

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/workouts', workoutsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app