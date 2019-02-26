
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

// `GET /api/zoos/:id`

// When the client makes a `GET` request to `/api/zoos/:id`, find the _zoo_ associated with the given `id`. Remember to handle errors and send the correct status code.

 // retrieve a zoo by id:

server.get('/api/zoos/:id', (req, res) => {
 
  db('zoos')
  .where({id: req.params.id})
  .then(zoo => {
    res.status(200).json(zoo)
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

// DELETE /api/zoos/:id

// When the client makes a `DELETE` request to this endpoint, the _zoo_ that has the provided `id` should be removed from the database.

// remove a zoo from the db:

server.delete('/api/zoos/:id', (req, res) => {
db('zoos')
.where({ id: req.params.id })
.del()
.then(response=> {
  if ( response > 0 ) {
    res.status(200).json({ message: 'The requested zoo has successfully been deleted.' })
  }else{
    res.status(404).json({ message: 'Requested zoo cannot be found' })
}
})
.catch(err => {
  res.status(500).json(err)
  })
})


// PUT /api/zoos/:id

// When the client makes a `PUT` request to this endpoint passing an object with the changes, the _zoo_ with the provided `id` should be updated with the new information.

 // update a zoo:
server.put('/api/zoos/:id', (req, res) => {
 
 db('zoos')
 .where({ id: req.params.id })
 .update(req.body)
 .then(response => { // data that you get back will be greater than 0 
   if( response > 0 ) {
     db('zoos')
     .where({ id: req.params.id })
     .first()
     .then(zoo => {
       res.status(200).json(zoo)
     })
   } else {
     res.status(404).json({ message: 'Requested zoo not found. '})
   }
 })
 .catch(error => {
   res.status(500).json(error)
 })
}); 










const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
