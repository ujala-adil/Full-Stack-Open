import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad
  const average = total === 0 ? 0 : (good - bad) / total;
  const positive = total === 0 ? 0 : (good / total) * 100;

  return (
    <div>
      <Heading title='give feedback'/>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />

      <Heading title='statistics'/>
      <Display rating="good" count={good} />
      <Display rating="neutral" count={neutral} />
      <Display rating="bad" count={bad} />

      <p>all {total}</p>
      <p>average {average}</p>
      <p>positive {positive}%</p>
    </div>
  )
}

const Heading = ({title}) => <h1>{title}</h1>

const Display = ({rating, count}) => <p>{rating} {count}</p>

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

export default App