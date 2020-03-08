const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const sharp = require('sharp');
// let transporter = require('../email/config');
const sendMail = require('../email/config');

const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 1000000 // 1MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|gif)$/)) {
            return cb(new Error('Plese upload a PNG/JPG/JPEG/GIF'));
        }

        cb(undefined, file.originalname);

        // cb(new Error('File must be PDF'));
        // cb(undefined, true);
        // cb(undefined, false);
    }
});

// Tạo biến môi trường trong POSTMAN
// B1: Tạo biến môi trường. VD: biến URL thay cho localhost:3000
// B2: Sử dụng: thay thế localhost:3000 trên path bằng -> {{URL}}

// Set authenticate cho tất cả các request trong 1 collection
// B1: Ấn chuột phải vào collection và chọn 'Edit'
// B2: Bên tab Authorization điền vào biến môi trường {{authToken}} hoặc cung cấp mã token trực tiếp

// Set gía trị token mới khi user login hoặc signup thay thế vào mọi request authenticate của 
// 1 collection tức là tự động cập nhật mã token mới nhất khi user signup hoặc login vào Bearer Token của collection đó
// thì chèn đoạn mã JS sau vào tab Tests của request 'login'

// if(pm.response.code === 200){
//     pm.environment.set('authToken', pm.response.json().token)
// }

// authToken lấy ở tab Authorization trong {{authToken}}
// pm.response.json().token: là giá trị token trả về mỗi khi login thành công


// sign up / create new user  and send email to ask new user to verify account
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();

        // send mail to new user and ask new user to verify account
        sendMail(req, req.body.email, token);

        res.status(201).send({ user, token });
    } catch (err) {
        console.log('err1: ', err);

        res.status(400).json({
            error: 'Please check email to verify this email'
        })
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.json({
            message: 'Logout success'
        })
    } catch (error) {
        res.status(500).send()
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        // req.user.tokens = req.user.tokens.filter(token => {
        //     return token.token !== req.token;
        // });
        req.user.tokens = [];
        await req.user.save();

        res.json({
            message: 'Logout all success'
        })
    } catch (error) {
        res.status(500).send()
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = user.generateAuthToken();
        console.log('token: ', token);
        await user.save()
        res.send({ user, token });
    } catch (error) {
        // console.log(error);
        res.status(400).send(error)
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.json(req.user);
});

// router.get('/users/:id', auth, async (req, res) => {
//     const _id = req.params.id;

//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user);
//     } catch (err) {
//         res.status(500).send()
//     }

// });

router.patch('/users/me', auth, async (req, res) => {
    // Các trường được phép update trong User: 
    const allowedUpdate = ['name', 'age', 'password', 'email'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(function (update) {
        return allowedUpdate.includes(update);
    });

    // Cách 3
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!' })
    }

    // every() sẽ lặp qua từng phần tử của mảng updates 
    // Nếu tất cả thuộc tính của req.body gửi lên trùng với các trường được cho phép update thì return kết quả true
    // Nếu tồn tại 1 thuộc tính của req.body khác với các trường được cho phép thì return kết quả false

    try {

        updates.forEach(update => req.user[update] = req.body[update]); // update theo các trường được phép, truyền tử req.body
        await req.user.save(); // lưu lại vào DB

        res.send(req.user);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {

        // Xóa user đã authenticate
        await req.user.remove();
        res.send(req.user);

    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

// Sử dụng findByID khi cần tìm 1 kết quả theo ID
// Sử dụng findOne khi cần tìm 1 kết quả có thể theo email, id, ....


router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 300, height: 300 }).png().toBuffer()

    req.user.avatar = buffer;

    await req.user.save();
    res.send();

}, (err, req, res, next) => {

    res.status(400).send({ error: err.message });

});

// delete avater
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send('delete avatar succees');
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send();
    }
});

module.exports = router;