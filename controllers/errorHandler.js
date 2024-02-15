const errorHandler = (error, request, response, next) => {
  
  return response.status(400).send({ error: error.message })

  next(error)
}


module.exports = errorHandler