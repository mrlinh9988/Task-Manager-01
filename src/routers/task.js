const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);

    } catch (err) {
        res.status(400).send(err)
    }

});

router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find();
        res.send(tasks)
    } catch (error) {
        res.status(500).send();
    }

});

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send()
        }

        res.send(task);
    } catch (err) {
        res.status(500).send()
    }
});

router.patch('/tasks/:id', async (req, res) => {
    const id = req.params.id;
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
        const task = await Task.findById(id);

        updates.forEach(update => {
            task[update] = req.body[update];
        });

        task.save();
        // const task = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!task) {
            return res.send(404).send();
        }

        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
});


router.delete('/tasks/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const task = await Task.findByIdAndDelete(id)

        if (!task) {
            return res.status(404).send();
        }

        res.send(task)
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});


module.exports = router;
