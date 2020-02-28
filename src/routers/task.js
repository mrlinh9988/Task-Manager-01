const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');
const User = require('../models/user');

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);


    const task = new Task({
        ...req.body,
        owner: req.user._id
    });


    try {
        task.owner = req.user._id;
        await task.save();
        res.status(201).send(task);

    } catch (err) {
        res.status(400).send(err)
    }

});

// GET /tasks?completed=true (false)
// GET /tasks?limit3=?page=1
// GET /tasks/sortBy=createAt_ase
// sort nếu giá trị là 1 -> ase , giá trị là -1 -> desc
router.get('/tasks', auth, async (req, res) => {

    const sort = {}
    const match = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'; // ==> Nếu query là true thì math.completed = true và ngược lại  
        console.log(req.query.completed === 'true');
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        // tương tự với:
        // if (parts[1] === 'desc') { 
        //     sort[parts[0]] = -1;
        // } else {
        //     sort[parts[0]] = 1;
        // }
    }

    try {
        await req.user
            .populate({
                path: 'tasks',
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: (parseInt(req.query.page) - 1) * parseInt(req.query.limit),
                    // skip: parseInt(req.query.skip)
                    sort
                }

            })
            .execPopulate()

        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send();
    }

});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send()
        }

        await task.populate('owner').execPopulate()

        res.send(task);
    } catch (err) {
        res.status(500).send()
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const allowedUpdate = ['description', 'completed'];
    // Mảng các thuộc tính của object req.body
    const updates = Object.keys(req.body);

    const isValid = updates.every(update => {
        return allowedUpdate.includes(update)
    });

    if (!isValid) {
        return res.status(400).send({ error: 'Invalid update' })
    }

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.send(404).send();
        }

        updates.forEach(update => {
            task[update] = req.body[update];
        });

        task.save();
        // const task = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
});


router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        task.remove();

        if (!task) {
            return res.status(404).send();
        }

        res.send({ message: 'Delete task success' });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});


module.exports = router;
