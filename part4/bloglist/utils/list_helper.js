const logger = require('./logger.js')
const _ = require('lodash');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let sum = 0;
  // logger.info(blogs)

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

const mostBlogs = (blogs) => {
  const blogCounts = _.countBy(blogs, 'author') //Loops through the blogs array and counts how many times each author appears.
  //   output of countby: It's a simple object where the keys are the author names and the values are the number of blogs.
  //{
  //   Robert C. Martin: 2,
  //   Edsger W. Dijkstra: 1
  // }
  const topAuthor = _.maxBy(_.keys(blogCounts), author => blogCounts[author])

  // _.keys(blogCounts) -> gets an array of authors, e.g., ['Robert C. Martin', 'Edsger W. Dijkstra'].
  // _.maxBy(..., callback) -> finds the author name whose count is highest, by passing each author to blogCounts[author].
  // Final result: 'Robert C. Martin'

  // logger.info(`${blogCounts[topAuthor]} ${topAuthor}`);

  return {
    author: topAuthor,
    blogs: blogCounts[topAuthor]
  }
}

// function sum(n) {
//   //  logger.info(n) //n is one object
//   // logger.info(n.b)

//   let sum = 0;
//   const reducer = (total, blog) => {
//     logger.info(blog.b)
//     return total + blog.b
//   }
//   sum = n.reduce(reducer, 0)

//   logger.info(sum)
//   return sum
//   // return n.reduce((sum, blog) => sum + blog.likes, 0)
// }

const mostLikes = (blogs) => {

  let groupedBlogs = _(blogs).groupBy('author').value()
  // logger.info(groupedBlogs)

  // let exaample = _.map({ 'a': 4, 'b': 8 }, square)
  // let exaample = _.mapValues(blogs, sum)
  // logger.info(exaample)

  // let sumByBlog = _(blogs).sumBy('likes')
  // logger.info(sumByBlog)

  const likesPerAuthor = _.mapValues(groupedBlogs, (blog) => _.sumBy(blog, 'likes'));
  logger.info(likesPerAuthor)

  let maxLikes = Math.max(...Object.values(likesPerAuthor))
  logger.info(maxLikes)

  const topAuthor = Object.keys(likesPerAuthor).find(author => likesPerAuthor[author] === maxLikes);

  return {
    author: topAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}