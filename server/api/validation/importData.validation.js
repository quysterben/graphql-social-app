const yup = require('yup')

const importUserDataSchema = yup.object().shape({
    name: yup.string().min(2).max(100),
    email: yup.string().min(3).max(255).email(),
    dateOfBirth: yup.string().notRequired(),
    from: yup.string().notRequired().min(2).max(100),
    banned: yup.boolean().notRequired(),
})

module.exports = {
    importUserDataSchema,
}
