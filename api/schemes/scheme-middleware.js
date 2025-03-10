const yup = require('yup')
const Schemes = require('./scheme-model')

// const schemeSchema = yup.object().shape({
//   scheme_name: yup.string().typeError("invalid scheme_name").required("invalid scheme_name")
// })

const stepSchema = yup.object().shape({
  instructions: yup.string().typeError("invalid step").required('invalid step'),
  step_number: yup.number().typeError("invalid step").min(1, "invalid step")
})

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = (req, res, next) => {
  Schemes.findById(req.params.scheme_id).then(scheme => {
    scheme ? next() : res.status(404).json({message: `scheme with scheme_id ${req.params.scheme_id} not found`})
    }).catch(err => {
      next(err)
    })
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const { scheme_name } = req.body
  if (scheme_name === undefined ||
    typeof scheme_name !== 'string' ||
    !scheme_name.trim()) {
      next({status: 400, message: "invalid scheme_name"})
    } else {
      next()
    }
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  stepSchema.validate(req.body).then(validated => {
    next()
  }).catch(err => {
    err.message.includes("invalid") ? res.status(400).json({message: err.message}) : next(err)
  })
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
