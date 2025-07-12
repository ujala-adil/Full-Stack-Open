const Blog = require('../models/blog')
const User = require('../models/user')

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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb
}