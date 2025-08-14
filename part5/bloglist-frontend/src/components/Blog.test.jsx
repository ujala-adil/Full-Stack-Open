import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Mary Poppins',
    url: 'https://reactpatterns.com/',
    likes: 0
  }

  const { container } = render(<Blog blog={blog}/>)

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


test('clicking the button once shows blog details', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Mary Poppins',
    url: 'https://reactpatterns.com/',
    likes: 0
  }

  // Blog component does not use a handler for toggling visibility, so no test needed for handler calls.
  // const mockHandler = vi.fn() //he event handler is a mock function defined with Vitest.

  const { container } = render(<Blog blog={blog} />)
  // screen.debug()
  const user = userEvent.setup() // A session is started to interact with the rendered component.
  const button = screen.getByText('view') //The test finds the button based on the text from the rendered component
  await user.click(button) //and clicks the element. Clicking happens with the method click of the userEvent-library.

  // expect(mockHandler.mock.calls).toHaveLength(1) //The expectation of the test uses toHaveLength to verify that the mock function has been called exactly once.

  const detailedBlog = container.querySelector('.detailed-blog')
  // screen.debug(detailedBlog)

  expect(detailedBlog).toBeInTheDocument()
  expect(detailedBlog).not.toHaveStyle('display: none')

  expect(detailedBlog).toHaveTextContent('https://reactpatterns.com/')
  expect(detailedBlog).toHaveTextContent(0)
})