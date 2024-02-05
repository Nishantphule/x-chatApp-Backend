// import the express Router
const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

// endpoints

// delete user
usersRouter.delete('/deleteUser', async (req, res) => {
    const { username } = req.body
    const deletedUser = await User.deleteOne({ username: username })
    res.status(201).send({ message: "User Deleted", deletedUser })
})


// creates a new resource based on the request data
usersRouter.post('/signupUser', async (req, res) => {
    const { username, password, email } = req.body;

    const userFromDB = await User.findOne({ username: username })

    if (userFromDB) {
        const storedPassword = userFromDB.password;
        const isPasswordMatch = await bcrypt.compare(password, storedPassword)
        const isEmailMatch = userFromDB.email === email
        if (isPasswordMatch && isEmailMatch) {
            res.status(400).send({ "message": "User Already Exists" })
        }
        else {
            res.status(400).send({ "message": "Username Not Available" })
        }
    }

    else if (!/^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[#!@%&]).{8,}$/g.test(password)) {
        res.status(400).send({ "message": "Password must be atleast 8 letters including small letter, capital letter , number and special characters!" })
    }

    else {
        const salt = await bcrypt.genSalt(10)
        const passHash = await bcrypt.hash(password, salt);

        const user = new User({
            username: username,
            password: passHash,
            email: email,
        })

        const savedUser = await user.save()
        res.status(201).json({ message: 'user created successfully', user: savedUser });
    }


});

// get all users
usersRouter.get('/', async (req, res) => {
    await User.find({}, {})
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        })
});

module.exports = usersRouter;