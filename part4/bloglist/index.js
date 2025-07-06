require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const url = process.env.MONGODB_URI
mongoose.connect(url)

app.use(express.json())

app.get('/api/blogs', (request, response) => {
    Blog.find({}).then((blogs) => {
        response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)
    console.log(`${blog}`)
    blog.save().then((result) => {
        response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})