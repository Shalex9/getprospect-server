const { Router } = require('express')
const User = require('./../models/user')
const router = Router()
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
	User.find({}, (err, result) => {
		if (err) {
			console.log(err);
			res.json(err);
		} else {
			console.log(result);
			res.json(result);
		}
	})
})

router.post('/login', async (req, res) => {
	console.log("req.body", req.body)
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user) {
			res.status(404).json({ message: "User not found" })
		}
	})

	User.findOne({ email: req.body.email, password: req.body.password }, (err, user) => {
		console.log("user", user)
		if (user) {
			const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "1h" })
			console.log("user is authtentificate successfully");
			res.status(200).send({ _id: user._id, token: token });
		} else {
			res.status(404).json({ message: "password is incorrect" });
			console.log("password is incorrect");
		}
	})
})

router.post('/singup', async (req, res) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (user) {
			res.status(404).json({ message: "user with same email is already registered" })
		}
	})
	const newUser = new User({
		email: req.body.email,
		password: req.body.password
	})

	try {
		await newUser.save()
		res.status(200).json({ message: "User was created" })
	} catch (e) {
		console.log(e)
		throw new Error(e)
	}
})

module.exports = router