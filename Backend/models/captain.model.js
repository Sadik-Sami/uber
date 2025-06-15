const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
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
		lowercase: true,
		match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
	socketId: {
		type: String,
	},
	status: {
		type: String,
		enum: ['active', 'inactive'],
		default: 'inactive',
	},
	vehicle: {
		color: {
			type: String,
			required: true,
			minlength: [3, 'Color must be at least 3 characters long'],
			trim: true,
		},
		plate: {
			type: String,
			required: true,
			minlength: [3, 'Plate must be at least 3 characters long'],
			trim: true,
		},
		capacity: {
			type: Number,
			required: true,
			min: [1, 'Capacity must be at least 1 person'],
		},
		vehicleType: {
			type: String,
			required: true,
			enum: ['car', 'motorcycle', 'auto'],
		},
	},
  location: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  }
});

/**
 * Generates a JSON Web Token (JWT) that is valid for 24 hours.
 * @returns {Promise<string>} - A JWT token
 */
captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
};

/**
 * @description Hashes a password using bcrypt
 * @param {string} password - Password to hash
 * @returns {Promise<string>} - Hashed password
 */
captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10)
};

/**
 * Compares a given password with the hashed password in the document.
 * @param {string} password - Password to compare
 * @returns {Promise<boolean>} - True if the password is correct, false otherwise
 */
captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


module.exports = mongoose.model('Captain', captainSchema);