const yup = require('yup')

const postSchema = yup.object().shape({
    content: yup.string().min(4),
})

module.exports = postSchema
