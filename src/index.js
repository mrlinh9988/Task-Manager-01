const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('./db/mongoose');
// require('dotenv').config()
// ./node_modules/.bin/env-cmd -f ./config/dev.env nodemon src/index.js

const app = express();
const port = process.env.PORT;


const multer = require('multer');
const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 20000000 // 20MB
    }
});
app.post('/upload', upload.single('avatar'), (req, res) => {
    res.json({ message: 'upload success' });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(userRouter);
app.use(taskRouter);



app.listen(port, console.log('Server started on port ', port));


const Task = require('./models/task');
const User = require('./models/user');

// const main = async () => {

//     // Find task which user created: 
//     const task = await Task.findById('5e4981ae14380a32c4d3ea7f');

//     await task.populate('owner').execPopulate();
//     console.log(task);

// }

// main();











    // const task = await Task
    //     .findById('5e4981ae14380a32c4d3ea7f')
    //     .populate('owner')
    //     .exec();
    // console.log(task.owner);

    // Find user who created tasks
    // try {
    //     const user = await User
    //         .findById('5e48137ab323692b10c4f5d7')
    //         .populate('tasks')
    //         .exec();
    //     // await user.populate('tasks').execPopulate(); // truyền tên virtual field

    //     console.log(user.tasks);
    // } catch (error) {
    //     console.log(error);
    // }