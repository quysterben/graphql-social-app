const yup = require('yup')

const conversationNameSchema = yup.object().shape({
    name: yup.string().min(4).max(20),
})

module.exports = conversationNameSchema
