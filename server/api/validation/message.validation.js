const yup = require('yup')

const conversationNameSchema = yup.object().shape({
    name: yup.string().min(4).max(255),
})

module.exports = conversationNameSchema
