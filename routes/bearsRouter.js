const bearRouter = require('express').Router();
const knex = require('knex');

const KnexConfig = {
	client: 'sqlite3',
	useNullAsDefault: true,
	connection: {
		filename: './data/lambda.sqlite3'
	}
};

const db = knex(KnexConfig);

//GET:

bearRouter.get('/', (req, res) => {
	db('bears')
		.then((bears) => {
			res.status(200).json(bears);
		})
		.catch((error) => {
			res.status(500).json(error);
		});
});


// GET by Id:

bearRouter.get('/:id', (req, res) => {
	db('bears')
		.where({ id: req.params.id })
		.then((bear) => {
			res.status(200).json(bear);
		})
		.catch((error) => {
			res.status(500).json(error);
		});
});

// POST:

bearRouter.post('/', (req, res) => {
	db('bears')
		.insert(req.body)
		.then((bearID) => {
			const [ id ] = bearID;
			db('bears').where({ id }).first().then((bear) => {
				res.status(201).json(bear);
			});
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});


// DELETE:

bearRouter.delete('/:id', (req, res) => {
	db('bears')
		.where({ id: req.params.id })
		.del()
		.then((response) => {
			if (response > 0) {
				res.status(200).json({ message: 'The requested bear has successfully been deleted.' });
			} else {
				res.status(404).json({ message: 'Requested bear cannot be found' });
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});


// PUT: 

bearRouter.put('/:id', (req, res) => {
	db('bears')
		.where({ id: req.params.id })
		.update(req.body)
		.then((response) => {
			
			if (response > 0) {
				db('bears').where({ id: req.params.id }).first().then((bears) => {
					res.status(200).json(bears);
				});
			} else {
				res.status(404).json({ message: 'Requested bear not found. ' });
			}
		})
		.catch((error) => {
			res.status(500).json(error);
		});
});

module.exports = bearRouter;