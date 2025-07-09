const Blog = require('../models/blog')

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

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}