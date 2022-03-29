const { Schema, model } = require('mongoose')

const repositorySchema = new Schema({
	owner: {
		type: String,
		required: true
	},
	projectname: {
		type: String,
		required: true
	},
	projecturl: {
		type: String,
		required: true
	},
	stars: Number,
	forks: Number,
	issues: Number,
	created: Date
})

module.exports = model('Repository', repositorySchema)