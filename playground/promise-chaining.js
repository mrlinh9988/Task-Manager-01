// DB
require('../src/db/mongoose');
const User = require('../src/models/user');

// User.findByIdAndUpdate('5e1dffeff42d8f33448479fc', {
//     age: 22
// })
//     .then(user => {
//         console.log(user);
//         return User.countDocuments({ age: 22 })
//     })
//     .then(count => {
//         console.log('user: ', count);
//     })
//     .catch(err => console.log(err))


const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    return count;
}

// trả về 1 promise
updateAgeAndCount('5e2fc4d78012682d50cb8f73', 22)
    .then(count => {
        console.log('count: ', count);
    })
    .catch(err => console.log(err))