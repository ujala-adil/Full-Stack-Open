const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
        .then(blog => {
            if (blog) {
                response.json(blog)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

blogsRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', (request, response, next) => {
    const { title, author, url, likes } = new Blog(request.body)

    Blog.findById(request.params.id)
        .then(blog => {
            if (!blog) {
                return response.status(404).end()
            }

            blog.title = title
            blog.author = author
            blog.url = url
            blog.likes = likes

            return blog.save().then((updatedBlog) => {
                response.json(updatedBlog)
            })
        })
        .catch(error => next(error))
})

module.exports = blogsRouter


//The event handlers of routes are commonly referred to as controllers.