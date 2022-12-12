const mongoose = require('mongoose')

const Task = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    dueDate: {
        type: Date, 
        required: true
    },
    completed: {
        type: Boolean, 
        required: true
    },
    priority: {
        type: Number, 
        required: true
    },
    user: {
        type: String, 
        required: true
    }
})

module.exports = mongoose.model('Task', Task) //pokeUser is the name of the collection in the db
