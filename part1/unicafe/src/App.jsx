import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0.0)

  const goodValue = 1
  const neutralValue = 0
  const badValue = -1

  const handleGood = () => {
    const updatedgood = good + 1
    const total = updatedgood + neutral + bad
    setGood(updatedgood)
    setTotal(total)
    setAverage(CalculateAverage(updatedgood, neutral, bad, total))
    setPositive(CalculatePositive(updatedgood, total))
  }

  const handleNeutral = () => {
    const updatedNeutral = neutral + 1
    const total = good + updatedNeutral + bad
    setNeutral(updatedNeutral)
    setTotal(total)
    setAverage(CalculateAverage(good, updatedNeutral, bad, total))
    setPositive(CalculatePositive(good, total))
  }

  const handleBad = () => {
    const updatedBad = bad + 1
    const total = good + neutral + updatedBad
    setBad(updatedBad)
    setTotal(total)
    setAverage(CalculateAverage(good, neutral, updatedBad, total))
    setPositive(CalculatePositive(good, total))
  }

  const CalculateAverage = (good, neutral, bad, total) => {
    const totalGoodValue = good * goodValue
    const totalNeutralValue = neutral * neutralValue
    const totalBadValue = bad * badValue
    const totalValue = totalGoodValue + totalNeutralValue + totalBadValue
    return totalValue / total
    // console.log(avg)
  }

  const CalculatePositive = (good, total) => {
    console.log(good)
    return ((good / total) * 100)
  };

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