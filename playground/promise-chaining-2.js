require('../src/db/mongoose');
const Task = require('../src/models/task');

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed: false });
    return count;
}


deleteTaskAndCount('5e2fafd86294fd1c54c81838')
    .then(count => {
        console.log('count: ', count);
    })
    .catch(err => console.log(err))