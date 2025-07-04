
//NO LONDER USING THIS FILE
//THIS FILE WAS FOR AND LAST USED IN EX: 3.12 COMMAND-LINE DATABASE
const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://ujala123:${password}@cluster0.sc1xqkc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
//const url = `mongodb+srv://ujala123:${password}@cluster0.sc1xqkc.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length === 3) {
    Person.find({}).then(persons => {
        console.log(`phonebook:`)
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        })
        mongoose.connection.close()
    })

} else if (process.argv.length === 5) {
    const person = new Person({
        name: name,
        number: number,
    })
    person.save().then(result => {
        console.log('person contact saved!')
        mongoose.connection.close()
    })

} else {
    console.log('Invalid number of arguments.\nPlease input as:\n  node mongo.js <password> [name number]');
    mongoose.connection.close();
}





