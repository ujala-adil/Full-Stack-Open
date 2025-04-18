
const Header = (props) => <h2>{props.course}</h2>

const Content = ({ parts }) => (
  <div>
    {parts.map(part => (
      <Part key={part.id} part={part} />
    ))}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <p><b>total of {props.total} exercises</b></p>

const Course = ({ course }) => {

  // var sum = course.parts.reduce((sum, part)=>{
  //   console.log(sum, part.name)
  //   return sum + part.exercises
  // }, 0)
  // console.log(sum)

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total
        total={course.parts.reduce((sum, part) => sum + part.exercises, 0)}
      />
    </div>
  )
}

export default Course