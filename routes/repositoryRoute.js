const axios = require('axios');
const { Router } = require('express')
const Repository = require('../models/repository')
const router = Router()

const api = axios.create({
	baseURL: `https://api.github.com/repos/`
})

router.get('/', async (req, res) => {
	Repository.find({}, (err, result) => {
		if (err) {
			console.log(err);
			res.json(err);
		} else {
			console.log(result);
			res.json(result);
		}
	})
})

router.get('/:id', async (req, res) => {
	Repository.findOne({ _id: req.params.id }, (err, result) => {
		if (err) {
			console.log(err);
			res.json(err);
		} else {
			console.log(result);
			res.json(result);
		}
	})
})

router.post('/', async (req, res) => {
	console.log("search", req.body.search)
	let repo = null;
	try {
		await api.get(req.body.search).then(({ data }) => {
			repo = data;
		})
	} catch (e) {
		res.status(404).json({ message: `Repository not found. ${e}` })
		return;
	}

	try {
		Repository.findOne({ projecturl: repo.projecturl }, (err, repo) => {
			if (repo) {
				res.status(500).json({ message: "Repository with same name is already exist" })
				return;
			}
		})

		const newRepo = new Repository({
			owner: repo.owner.login,
			projectname: repo.name,
			projecturl: repo.html_url,
			stars: repo.stargazers_count,
			forks: repo.forks_count,
			issues: repo.open_issues,
			created: repo.created_at
		})

		await newRepo.save()
		res.status(200).json({ message: "Repository is added" })
	} catch (e) {
		res.status(500).json({ message: `Failed to add repository. ${e}` })
	}
})

router.put('/:id', async (req, res) => {
	console.log("req.body: ", req.body)
	try {
		await Repository.findOneAndUpdate({ _id: req.params.id }, {
			$set: {
				owner: req.body.owner,
				projectname: req.body.projectname,
				projecturl: req.body.projecturl,
				stars: req.body.stars,
				forks: req.body.forks,
				issues: req.body.issues,
				created: req.body.created
			}
		});
		res.status(200).json({ message: "Repository is edited" })
	} catch (e) {
		res.status(500).json({ message: `Failed to edit repository. ${e}` })
	}
})

router.delete('/', async (req, res) => {
	Repository.findOne({ _id: req.body.id }, (err, repo) => {
		if (!repo) {
			res.status(404).json({ message: "Repository not found" })
		}
	})

	try {
		await Repository.deleteOne({ _id: req.body.id })
		res.status(200).json({ message: "Repository was deleted" })
	} catch (e) {
		res.status(500).json({ message: `Failed delete repository. ${e}` })
	}
})

module.exports = router