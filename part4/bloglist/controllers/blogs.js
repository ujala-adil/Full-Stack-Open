const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

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

//ADDING THE MIDDLEWARE AS FOLLOWS ALLOWS THE OTHER METHODS NOT REQUIRING AUTH LIKE GET TO REMAIN PUBLIC
blogsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

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

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const user = request.user

    const blogToDelete = await Blog.findById(request.params.id)
    if (!blogToDelete) {
        return response.status(404).json({ error: 'blog not found' })
    }

    if (blogToDelete.user.toString() === user._id.toString()) {
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