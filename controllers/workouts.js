const workoutsRouter = require('express').Router()
const Workout = require('../models/workout')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

workoutsRouter.get('/', async (request, response) => {
    const workouts = await Workout.find({}).populate('user', { username: 1 })
    response.json(workouts)
})

workoutsRouter.get('/:id', async (request, response) => {
    const workout = await Workout.findById(request.params.id)
    if (workout) {
      response.json(workout)
    } else {
      response.status(404).end()
    }
})

workoutsRouter.post('/', async (request, response, next) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = request.user

    const workout = new Workout({
        name: body.name,
        date: body.date,
        user: user._id,
        exercises: body.exercises 
    })

    if (!workout.name || !workout.date || !workout.exercises) {
        response.status(400).end()
    } else {
        const savedWorkout = await workout.save()
        /*user.workouts = user.workouts.concat(savedWorkout._id)
        await user.save()*/

        response.status(201).json(savedWorkout)
    }
})

workoutsRouter.delete('/:id', async (request, response) => {
  const workout = await Workout.findById(request.params.id)

  const user = request.user

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if(decodedToken) {
    if(workout.user.toString() === user.id) {
      await Workout.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } else {
      return response.status(401).json({ error: 'token invalid' })
    }
  } else {
    return response.status(401).json({ error: 'token invalid' })
  }

})

module.exports = workoutsRouter