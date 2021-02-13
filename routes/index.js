const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll;
        res.render('sequelize', { users });     // sequelize.html 랜더링 할 때 users 값 사용
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;