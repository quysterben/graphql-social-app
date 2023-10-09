const yup = require('yup')

const reportSchema = yup.object().shape({
    description: yup.string().min(10).max(255),
})

module.exports = reportSchema
