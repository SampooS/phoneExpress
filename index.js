const express = require('express')

const app = express(); 

app.use(express.json())

const morgan = require('morgan')

let db = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

/* app.use(requestLogger) */

app.use(morgan(function(tokens, req, res) {

  if (tokens.method(req).toString()!="POST") {
  return [
    tokens.method(req),
    tokens.url(req),
    tokens.status(req, res),
    tokens['response-time'](req, res), ("ms"),
  ].join(" ")
  } else {
    return [
    tokens.method(req),
    tokens.url(req),
    tokens.status(req, res),
    tokens['response-time'](req, res), ("ms"),
    JSON.stringify(req.body)
  ].join(" ")
  }
} ))


app.get('/', (req, res) =>{
  res.send('<h1>people</h1>')
})

app.get(`/people`, (req, res) => {
  res.json(db)
})

app.get(`/people/:id`, (req, res) => {

  const id = Number(req.params.id)
  const person = db.find(person => person.id === id);

  if (person) {
    res.json(person)
  } else {
    res.status(404).send("<h1>peepeepoopoo</h1>")
  }
})

app.get(`/info`, (req, res) => {
  const num = db.length
  const time = new Date();

  res.send(`There are ${num} entries in the database<br/>Time at request is: ${time}`)
})

app.delete(`/people/:id`, (req, res) => {
  const id = Number(req.params.id)
  db = db.filter(person => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.num) {
    return res.status(400).send({error: "data missing"})
  }

  let newId = 1

  while (!db.every(person => person.id!=newId)) {
    newId = Math.floor(Math.random()*Math.pow(10, 10))
  }

  let newPerson ={
    id: (newId),
    name: body.name,
    number: `${body.num}`
  }
  db = db.concat(newPerson)

  res.send(db);
})

/*
app.post(`:name/:num`, (req, res) => {

  if (db.every(person => person.name !== req.params.name) && !(req.params.name==null || req.params.num == null)) {
  newId = 1

  while (!db.every(person => person.id!=newId)) {
    newId = Math.floor(Math.random()*Math.pow(10, 10))
  }

  let newPerson = {
    "id": newId,
    "name": req.params.name,
    "number": req.params.num
  }

  db = db.concat([newPerson])
  res.json(db);
} else {
  res.status(400).send({error: "could not save person"})
} 
})

*/
const port = 3001

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
})
