const userModel = require('../models/user.model');

/**
 * Creates a new user in the system
 * @param {Object} data - User data
 * @param {string} data.firstname - First name
 * @param {string} data.lastname - Last name
 * @param {string} data.email - Email address
 * @param {string} data.password - Password
 * @returns {Promise} User document
 * @throws {Error} If any of the required fields are not provided
 */
module.exports.createUser = async ({ firstname, lastname, email, password }) => {
	if (!firstname || !email || !password) {
		throw new Error('All fields are required');
	}
	const user = userModel.create({
		fullname: {
			firstname,
			lastname,
		},
		email,
		password,
	});
	return user;
};
