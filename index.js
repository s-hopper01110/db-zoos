
const express = require('express');
const helmet = require('helmet');
const knex = require('knex');


const KnexConfig = {
  client:'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename:'./data/lambda.sqlite3'
  }
}

const db = knex(KnexConfig)
const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

// `GET /api/zoos`

// When the client makes a `GET` request to this endpoint, return a list of all the _zoos_ in the database. Remember to handle any errors and return the correct status code.

server.get('/api/zoos', (req, res) => {
  db('zoos')
  .then(zoos => {
    res.status(200).json(zoos)
  })
  .catch(error => {
    res.status(500).json(error)
  })
});






// When the client makes a `POST` request to this endpoint, a new _zoo_ should be created in the _zoos_ table.

// Ensure the client passes a `name` property in the request body. If there's an error, respond with an appropriate status code, and send a JSON response of the form `{ error: "Some useful error message" }`.

// Return the `id` of the inserted zoo and a 201 status code.


// add a zoo to the database:
server.post('/api/zoos', (req, res) => {
  
db('zoos')
.insert(req.body)
.then(zooID => {
  const [id] = zooID;
  db('zoos')
  .where({ id })
  .first()
  .then(zoo => {
    res.status(201).json(zoo);
  })
})
.catch(err => {
  res.status(500).json(err);
})
}); 




const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
