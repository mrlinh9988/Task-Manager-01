const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        // const token = req.headers.authorization.split(' ')[1];
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'linh');
        // console.log(decode);
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token }); // Tìm theo _id và token đó trong array tokens của user đó

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
        // console.log(user);

    } catch (error) {
        res.status(401).json({ error: 'Please authenticate.' });
    }

}

module.exports = auth;