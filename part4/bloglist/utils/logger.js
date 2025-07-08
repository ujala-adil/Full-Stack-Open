const info = (...params) => {

  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
}

const error = (...params) => {

  if (process.env.NODE_ENV !== 'test') { 
    console.error(...params)
  }
}

module.exports = {
  info, error
}


//REASON BEHIND ADDING THE NODE_ENV CHECKS:
//The middleware that outputs information about the HTTP requests is obstructing the test execution output. 
// Modify the logger so that it does not print to the console in test mode.

