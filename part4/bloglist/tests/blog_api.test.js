const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)

const initialBlogs = [
    {
        author: 'Brad Pitt',
        title: 'How to make movies',
        url: 'www.google.com',
        likes: 3,
    },
    {
        author: 'Lara Kroft',
        title: 'What is so good in Tomb Raider?',
        url: 'www.google.com',
        likes: 2,
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test.only('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test.only('unique identifier property of blog posts is named as id', async () => {
    const response = await api.get('/api/blogs');

    const blogs = response.body;
    const keys = Object.keys(blogs[0]);
    //   console.log(keys)
    const isNameId = keys.includes('id');
    assert.strictEqual(isNameId, true);
});


after(async () => {
    await mongoose.connection.close()
})