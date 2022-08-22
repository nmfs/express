require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()



app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

const persons = [{name: "hi", number: "23"}]

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
  //res.json(persons)
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(p => {
      if(p)
        res.json(p)
      else
        res.status(404).end()
    })
    .catch(err => next(err))
})


app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      if(!result)
        console.log('Person to delete not found')
      else
        console.log('Removed person : ', result)
      res.status(204).end()
    })
    .catch(err => next(err))
  /*Person.findOneAndRemove({_id: req.params.id}, (err, doc) => {
    if(err)
      console.log('error delete', err)
    else
      console.log('Removed person : ', doc)
  })
  res.status(204).end()*/
})

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


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.error(err.message)
  if(err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id'})
  }
  next(err)
}

app.use(errorHandler)   // last loaded middleware
