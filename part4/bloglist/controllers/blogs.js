const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!user) {
        return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const blog = new Blog({
        author: body.author,
        title: body.title,
        url: body.url,
        likes: body.likes,
        user: user._id

    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!user) {
        return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const blogToDelete = await Blog.findById(request.params.id)
    if (!blogToDelete) {
        return response.status(404).json({ error: 'blog not found' })
    }

    if (blogToDelete.user.toString() === decodedToken.id.toString()) {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    }
    else {
        return response.status(403).json({ error: 'unauthorized to delete this blog' })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = new Blog(request.body)

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
        return response.status(404).end()
    }

    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes

    const updatedBlog = await blog.save();
    response.json(updatedBlog);
})

module.exports = blogsRouter


//The event handlers of routes are commonly referred to as controllers.