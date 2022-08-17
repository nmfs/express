const express = require('express')
const app = express()

app.use(express.json())

let persons = [
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

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if(person) {
    console.log(person)
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  console.log(`deleted id=${id}`)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if(!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing'})
  }
  if(persons.find(person => person.name === body.name)) {
    return res.status(400).json({ error: 'name must be unique'})
  }



  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random()*1000000),
  }
  console.log(person)
  persons = persons.concat(person)

  res.json(person)
})

app.get('/info', (req, res) => {
  res.send(`<div>Phonebook has info for ${persons.length} people</div>
      <br />
      <div>${new Date().toString()}</div>
`)
})

app.listen(3001, () => {
  console.log(`Server running on port 3001`)
})