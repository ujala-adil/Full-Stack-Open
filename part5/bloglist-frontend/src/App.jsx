import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null })

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, isError = false) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
  }

  const changeBlogLikes = (id, updatedBlog) => {
    blogService.updateLikes(id, updatedBlog).then((returnedBlog) => {
      setBlogs(blogs.map((b) => (b.id !== id ? b : returnedBlog)))
      notifyWith(
        `the likes for the blog ${returnedBlog.title} by ${returnedBlog.author} has been updated`,
        false,
      )
    })
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility() //hide blog form after new blog is added

    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog))
      notifyWith(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        false,
      )
    })
  }

  const deleteBlog = (blog) => {
    const confirmDelete = window.confirm(`Delete ${blog.title}?`)

    if (confirmDelete) {
      blogService.deleteBlog(blog.id).then(() => {
        setBlogs(blogs.filter((b) => b.id !== blog.id)) //remove blog from the list //filter returns a new array which is the changed one based on the condition inside.
        notifyWith(`the blog ${blog.title} by ${blog.author} removed`, false)
      })
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      // console.log(user)
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notifyWith('wrong username or password', true)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  return (
    <div>
      {user === null ? (
        <div>
          <Notification notification={notification} />
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <Notification notification={notification} />
          {user.name} logged-in
          <button type='submit' onClick={handleLogout}>
            logout
          </button>
          <h2>create new</h2>
          {blogForm()}
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                changeBlogLikes={changeBlogLikes}
                deleteBlog={deleteBlog}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
