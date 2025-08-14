import { useState } from 'react'

const Blog = ({ blog, user, deleteBlog, changeBlogLikes }) => {
  const [blogVisible, setBlogVisibility] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const detailedBlogVisible = { display: blogVisible ? '' : 'none' } //when true detailed blog displayed
  const shortBlogVisible = { display: blogVisible ? 'none' : '' } //when false short blog displayed

  const changeLikes = (event) => {
    event.preventDefault()
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    changeBlogLikes(blog.id, updatedBlog)
  }

  const removeBlog = (event) => {
    event.preventDefault()
    deleteBlog(blog) //deleteBlog function is defined in App.jsx and passed as a prop
  }

  return (
    <div style={blogStyle} className='blog'>
      <div style={shortBlogVisible} className='short-blog'>
        {blog.title} {blog.author}
        <button onClick={() => setBlogVisibility(true)}>view</button>
      </div>

      <div style={detailedBlogVisible} className='detailed-blog'>
        <p>
          {blog.title} {blog.author}{' '}
          <button onClick={() => setBlogVisibility(false)}>hide</button>
        </p>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes}
          <button onClick={changeLikes}>like</button>
        </p>
        <p>{blog.user ? blog.user.name : ''}</p>
        {/* {console.log('logged in user', user)}
        {console.log('bloguser' ,blog.user)} */}
        {blog.user && user && blog.user.username === user.username && (
          <button onClick={removeBlog}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog
