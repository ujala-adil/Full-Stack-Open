import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('checking if the form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const createBlog = vi.fn() //The event handler is a mock function defined with Vitest.
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  // const inputs = screen.getAllByRole('textbox')
  // screen.debug(inputs)
  //   await user.type(inputs[0], 'Component testing is done with react-testing-library')
  //   await user.type(inputs[1], 'Mary Poppins')
  //   await user.type(inputs[2], 'https://reactpatterns.com/')

  await user.type(screen.getByPlaceholderText('title'), 'Component testing is done with react-testing-library')
  await user.type(screen.getByPlaceholderText('author'), 'Mary Poppins')
  await user.type(screen.getByPlaceholderText('url'), 'https://reactpatterns.com/')

  await user.click(screen.getByText('create'))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Component testing is done with react-testing-library',
    author: 'Mary Poppins',
    url: 'https://reactpatterns.com/'
  })
})