const logger = require('./logger.js')


const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let sum = 0;
  logger.info(blogs)

  if (blogs.length === 1) {
    sum = blogs[0].likes
  }
  else if (blogs.length > 1) {
    const reducer = (total, blog) => {
      return total + blog.likes
    }
    sum = blogs.reduce(reducer, 0)
  }

  return sum
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((favBlog, currentBlog) => {
    return currentBlog.likes > favBlog.likes ? currentBlog : favBlog
  })
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}