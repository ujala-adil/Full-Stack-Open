import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Mary Poppins',
    url: 'https://reactpatterns.com/',
    likes: 0
  }

  const { container } = render(<Blog blog={blog} />)

  const shortBlog = container.querySelector('.short-blog')
  expect(shortBlog).toBeInTheDocument()
  expect(shortBlog).not.toHaveStyle('display: none')

  expect(shortBlog).toHaveTextContent('Component testing is done with react-testing-library')
  expect(shortBlog).toHaveTextContent('Mary Poppins')
  expect(shortBlog).not.toHaveTextContent('https://reactpatterns.com/')
  expect(shortBlog).not.toHaveTextContent(0)


  const detailedBlog = container.querySelector('.detailed-blog')
  expect(detailedBlog).toHaveStyle('display: none')

})