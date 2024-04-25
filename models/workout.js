const mongoose = require('mongoose')

const workoutSchema = mongoose.Schema({
    name: String,
    date: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    exercises: [
        {
            name: String,
            weight: Number,
            reps: Number
        }
    ]
})

workoutSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Workout', workoutSchema)