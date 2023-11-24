const yup = require('yup')

const commentSchema = yup.object().shape({
    content: yup.string().min(2).max(255),
})

module.exports = commentSchema
