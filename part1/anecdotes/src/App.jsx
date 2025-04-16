import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVote] = useState(Array(anecdotes.length).fill(0))

  const handleVotes = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVote(copy)
  }

  let highestVotedAnecdote = votes.indexOf(Math.max(...votes));

  return (
    <div>
      <Heading title="Anecdote of the day"/>
      <Display anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button text="vote" onClick={handleVotes} />
      <Button text="next anecdote" onClick={() => setSelected(Math.floor(Math.random() * anecdotes.length))} />

      <Heading title="Anecdote with most votes"/>
      <Display anecdote={anecdotes[highestVotedAnecdote]} votes={votes[highestVotedAnecdote]} />
      </div>
  )
}

const Heading = ({ title }) => <h1>{title}</h1>

const Display = ({ anecdote, votes }) => (
  <>
    <p>{anecdote}</p>
    <p>has {votes} votes</p>
  </>
)

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>

export default App