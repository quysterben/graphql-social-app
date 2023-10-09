const yup = require('yup')

const postSchema = yup.object().shape({
    title: yup.string().min(4).max(255),
    content: yup.string().min(4).max(255),
})

module.exports = postSchema
