const BlogForm = ({ onSubmit, handleChange, value }) => {
    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={onSubmit}>
                title: <input
                    name="title"
                    value={value.title}
                    onChange={handleChange}
                />
                <br />
                author: <input
                    name="author"
                    value={value.author}
                    onChange={handleChange}
                />
                <br />
                url: <input
                    name="url"
                    value={value.url}
                    onChange={handleChange}
                />
                <br />
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm