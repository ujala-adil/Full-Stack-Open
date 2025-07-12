const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
    let token = ''

    beforeEach(async () => {
        await Blog.deleteMany({})

        // const blogObjects = helper.initialBlogs
        //     .map(blog => new Blog(blog))
        // const promiseArray = blogObjects.map(blog => blog.save())
        // await Promise.all(promiseArray)
        await Blog.insertMany(helper.initialBlogs)

        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'tester', passwordHash })
        await user.save()

        const response = await api
            .post('/api/login')
            .send({ username: 'tester', password: 'sekret' })

        token = response.body.token

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
    })

    describe('addition of a new blog', () => {

        test('a blog can be added ', async () => {
            const newBlog = {
                author: 'Peter Parker',
                title: 'How to survive in the middle of the sea',
                url: 'www.seamiddle.com',
                likes: 10
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

            const authors = blogsAtEnd.map(r => r.author)
            assert(authors.includes('Peter Parker'))
        })

        test('blog without likes property has 0 likes by default', async () => {
            const newBlog = {
                author: 'Brianne Howey',
                title: 'How to be a good mother',
                url: 'www.mother.com'
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const response = await api.get('/api/blogs')
            const savedBlog = response.body.find(b => b.url === newBlog.url);
            assert.strictEqual(savedBlog.likes, 0);
        })

        test('blog without title property is not added', async () => {
            const newBlog = {
                author: 'Mr. Nobody',
                url: 'www.nothing.com',
                likes: 20
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })

        test('blog without url property is not added', async () => {
            const newBlog = {
                author: 'Mr. Nobody',
                title: 'How to not do anything',
                likes: 20
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })

        test('if no token is provided blog is not added and status code 401 is returned', async () => {
            const newBlog = {
                author: 'William',
                title: 'A blog without token',
                url: 'www.blogwithouttoken.com',
                likes: 7,
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })

    })

    describe('deletion of a blog', () => {
        test('succeeds with status code 204 if id is valid and blog is owned by the user', async () => {

            const newBlog = {
                author: 'Hannah',
                title: 'Deleting a blog authenticated',
                url: 'www.deleteblog.com',
                likes: 17,
            }

            const response = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)

            const blogToDelete = response.body

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            const authors = blogsAtEnd.map(b => b.author)
            assert(!authors.includes(blogToDelete.author))

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })

    describe('updating a blog', () => {
        test('succeeds with status code 200 if updated', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0]

            const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

            const response = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(updatedBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/);

            assert.strictEqual(response.body.likes, blogToUpdate.likes + 1);
        })
    })

})


after(async () => {
    await mongoose.connection.close()
})