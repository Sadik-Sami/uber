const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
	fullname: {
		firstname: {
			type: String,
			required: true,
			minlength: [3, 'First name must be at least 3 characters long'],
			trim: true,
		},
		lastname: {
			type: String,
			minlength: [3, 'Last name must be at least 3 characters long'],
			trim: true,
		},
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
	socketId: {
		type: String,
	},
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
	return token;
};

userSchema.methods.comparePassword = async function (password) {
	const isMatch = await bcrypt.compare(password, this.password);
	return isMatch;
};

userSchema.statics.hashPassword = async function (password) {
	return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
