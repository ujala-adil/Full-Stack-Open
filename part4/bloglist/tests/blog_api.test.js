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
        url: 'www.movies.com',
        likes: 3
    },
    {
        author: 'Lara Kroft',
        title: 'What is so good in Tomb Raider?',
        url: 'www.games.com',
        likes: 2
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('unique identifier property of blog posts is named as id', async () => {
    const response = await api.get('/api/blogs');

    const blogs = response.body;
    const keys = Object.keys(blogs[0]);
    //   console.log(keys)
    const isNameId = keys.includes('id');
    assert.strictEqual(isNameId, true);
});

test('a blog can be added ', async () => {
    const newBlog = {
        author: 'Peter Parker',
        title: 'How to survive in the middle of the sea',
        url: 'www.seamiddle.com',
        likes: 10
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const authors = response.body.map(r => r.author)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    assert(authors.includes('Peter Parker'))
})

test.only('blog without likes property has 0 likes by default', async () => {
    const newBlog = {
        author: 'Brianne Howey',
        title: 'How to be a good mother',
        url: 'www.mother.com'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs')
    const savedBlog = response.body.find(b => b.url === newBlog.url);
    assert.strictEqual(savedBlog.likes, 0);
})


after(async () => {
    await mongoose.connection.close()
})