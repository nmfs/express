const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Please provide the password as an argument: node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://nmfs:${password}@cluster0.ybtimyh.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = mongoose.Schema({ //new
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)


mongoose
  .connect(url)
  .then(() => {
    console.log('connected')

    if(process.argv.length === 5) {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      })
      return person.save()
    } else {
      console.log('phonebook:')
      return Person.find({}).then(result => {
        result.forEach(p => {
          console.log(`${p.name} ${p.number}`)
        })
        //mongoose.connection.close()
      })
    }
  })
  .then(() => {
    if(process.argv.length === 5)
      console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
  .catch((err) => console.log(err))
