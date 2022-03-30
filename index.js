const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoute')
const repositoryRoutes = require('./routes/repositoryRoute')
const dotenv = require("dotenv").config()
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use('/api/users', userRoutes)
app.use('/api/repositories', repositoryRoutes)

const PORT = process.env.SERVER_PORT || 7000
async function start() {
	try {
		await mongoose.connect(process.env.DATABASE_CONNECTION_STRING, { useNewUrlParser: true })
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`)
		})
	} catch (e) {
		console.log(e)
	}
}

start()