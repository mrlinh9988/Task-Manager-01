const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../models/task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Anonymous',
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            let status = validator.isEmail(value)
            if (!status) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password is not contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

// Virtual: sử dụng cho 2 hoặc nhiều collection có liên quan (tham chiếu field) đến nhau
// virtual không được lưu trữ trong database, nó không tác động đến data đã được lưu trong database
// để xác định who owns what and how they're related
// Trong trường hợp của collection User thì field '_id' được tham chiếu đến field 'owner' trong collection Task
// Tham số thứ nhất là tên bảng virtual
userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
});


// login with email and password
userSchema.statics.findByCredentials = async (email, password) => {
    // Tìm theo tên email trước
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

// Detele user's tasks when user is removed
userSchema.pre('remove', async function (next) {
    // cách 1:
    await Task.deleteMany({ owner: this._id });

    // cách 2:
    // await this.populate('tasks').execPopulate();
    // this.tasks.forEach(async task => {
    //     await Task.findByIdAndRemove({ _id: task._id });
    // });
    next();
});

// mongoose middleware hash the plaintext password 
userSchema.pre('save', async function (next) {
    // hash password before save user (create new user)
    // this lúc này sẽ tham chiểu đến user sẽ được save
    const user = this; // gán this lại bằng user 

    // Check xem password được update password hay chưa
    // trả về true nếu người dùng mới được tạo hoặc được update password
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    console.log('before saving user');

    // Khi code được chạy xong sẽ next đến middleware tiếp theo
    next();
});

// Functionc generate token
userSchema.methods.generateAuthToken = function () {
    // console.log(this);
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET); // vì this/_id là ObjectID nên cần chuyển thành String
    this.tokens = this.tokens.concat({ token });
    return token;
}


// Custom toJSON methods: Đây là hàm có sẵn mặc định được chạy mỗi khi 1 object được stringify 
// vì vậy có thể custom hàm toJSON để manipulate data tùy ý
// ví dụ khi res.send(obj) thì Express tự động stringigy obj và khi đó hàm toJSON cũng được chạy

userSchema.methods.toJSON = function () {

    // Chuyển dữ liệu dạng document của Mongoose thành raw object JS
    const userObject = this.toObject();

    // Xóa 2 thuộc tính của object 
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    // Chú ý không save 
    // Vì không muốn trả về cho client thông tin về password và tokens nên mới không gửi theo 2 thuộc tính này

    return userObject;
}

const User = mongoose.model('User', userSchema)


module.exports = User;