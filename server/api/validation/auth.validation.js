const yup = require('yup')

const registerSchema = yup.object().shape({
    name: yup.string().min(3).max(100),
    email: yup.string().min(3).max(255).email(),
    password: yup.string().min(8).max(16),
})

const loginSchema = yup.object().shape({
    email: yup.string().min(3).max(255).email(),
    password: yup.string().min(8).max(16),
})

module.exports = {registerSchema, loginSchema}
