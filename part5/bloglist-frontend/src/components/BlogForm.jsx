import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        title:{' '}
        <input
          name='title'
          value={newBlog.title}
          onChange={(event) =>
            setNewBlog({ ...newBlog, [event.target.name]: event.target.value })
          }
        />
        <br />
        author:{' '}
        <input
          name='author'
          value={newBlog.author}
          onChange={(event) =>
            setNewBlog({ ...newBlog, [event.target.name]: event.target.value })
          }
        />
        <br />
        url:{' '}
        <input
          name='url'
          value={newBlog.url}
          onChange={(event) =>
            setNewBlog({ ...newBlog, [event.target.name]: event.target.value })
          }
        />
        <br />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm
