const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('./db/mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(userRouter);
app.use(taskRouter);



app.listen(port, console.log('Server started on port ', port));


// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async () => {

//     // Find task which user created: 
//     // const task = await Task.findById('5e4981ae14380a32c4d3ea7f');
//     // await task.populate('owner').execPopulate();

//     // const task = await Task
//     //     .findById('5e4981ae14380a32c4d3ea7f')
//     //     .populate('owner')
//     //     .exec();
//     // console.log(task.owner);

//     // Find user who created tasks
//     try {
//         const user = await User
//             .findById('5e48137ab323692b10c4f5d7')
//             .populate('tasks')
//             .exec();
//         // await user.populate('tasks').execPopulate(); // truyền tên virtual field

//         console.log(user.tasks);
//     } catch (error) {
//         console.log(error);
//     }

// }

// main();

