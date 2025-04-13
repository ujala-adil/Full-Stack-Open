import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1);
  const handleNeutral = () => setNeutral(neutral + 1);
  const handleBad = () => setBad(bad + 1);

  return (
    <div>
      <Heading title='give feedback'/>
      <Button onClick={handleGood} text="good"/>
      <Button onClick={handleNeutral} text="neutral"/>
      <Button onClick={handleBad} text="bad"/>

      <Heading title='statistics'/>
      <Display rating='good' count={good}/>
      <Display rating='neutral' count={neutral}/>
      <Display rating='bad' count={bad}/>
    </div>
  )
}

const Heading = ({title}) => <h1>{title}</h1>

const Display = ({rating, count}) => <p>{rating} {count}</p>

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

export default App