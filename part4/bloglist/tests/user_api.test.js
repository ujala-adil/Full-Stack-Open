const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'david123',
            name: 'David Keller',
            password: 'davifkajd',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('user is not added if invalid', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'da',
            name: 'David Keller',
            password: 'da',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('status code and error message are thrown if user with invalid username is trying to be added', async () => {
        const newUser = {
            username: 'da',
            name: 'David Keller',
            password: '123',
        }

        var response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.error, 'username must be at least 3 characters long')
    })

    test('status code and error message are thrown if user with invalid password is trying to be added', async () => {
        const newUser = {
            username: 'David',
            name: 'David Keller',
            password: '12',
        }

        var response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.error, 'password must be at least 3 characters long')
    })
})

after(async () => {
    await mongoose.connection.close()
})