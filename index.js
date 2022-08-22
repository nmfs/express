require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(p => res.json(p))
  /*const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if(person) {
    console.log(person)
    res.json(person)
  } else {
    res.status(404).end()
  }*/
})

/*
app.delete('/api/persons/:id', (req, res) => {
  Person.deleteOne({ _id: req.params.id})
  res.status(204).end()
})
*/
app.post('/api/persons', (req, res) => {
  const body = req.body

  if(!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing'})
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(p => {
    res.json(p)
  })
})

/*
app.get('/info', (req, res) => {
  res.send(`<div>Phonebook has info for ${persons.length} people</div>
      <br />
      <div>${new Date().toString()}</div>
`)
})
*/

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})