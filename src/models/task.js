const validator = require('validator');
const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

taskSchema.pre('save', function () {
    // console.log('alo 123');
})

const Tasks = mongoose.model('Tasks', taskSchema);


module.exports = Tasks;

