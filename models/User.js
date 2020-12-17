const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, 'Please Enter Email'],
		unique: true,
		lowercase: true,
		validate: [isEmail, 'Please Enter A Valid Email']
	},
	password: {
		type: String,
		required: [true, 'Please Enter Password'],
		minlength: [6, 'Minimum Password Length Is 6 Characters']
	}
})


// fire a function before saved to db
userSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt()
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

// static method to login use
userSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email })
	if (user) {
		const auth = await bcrypt.compare(password, user.password)
		if (auth) {
			return user
		}
		throw Error('Incorrect Password')
	}
	throw Error('Incorrect Email')
}

module.exports = User = mongoose.model('user', userSchema)