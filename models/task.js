const mongoose = require('mongoose')

// #TODO: Add a due date field

const Task = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    completed: {
        type: Boolean, 
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String, 
        required: true
    }
})

module.exports = mongoose.model('Task', Task) // Task is the name of the collection in the db
