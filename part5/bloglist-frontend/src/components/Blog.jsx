import { useState } from 'react'

const Blog = ({ blog, changeBlogLikes }) => {
  const [blogVisible, setBlogVisibility] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const detailedBlogVisible = { display: blogVisible ? '' : 'none' } //when true detailed blog displayed
  const shortBlogVisible = { display: blogVisible ? 'none' : '' } //when false short blog displayed

  const changeLikes = (event) => {
    event.preventDefault()
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    changeBlogLikes(blog.id, updatedBlog)
  }

  return (
    <div style={blogStyle}>
      <div style={shortBlogVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setBlogVisibility(true)}>view</button>
      </div>

      <div style={detailedBlogVisible}>
        <p>{blog.title} {blog.author} <button onClick={() => setBlogVisibility(false)}>hide</button></p>
        <p>{blog.url}</p>
        <p>likes {blog.likes}<button onClick={changeLikes}>like</button></p>
        <p>{blog.user ? blog.user.name : ''}</p>
      </div>
    </div>
  )
}

export default Blog