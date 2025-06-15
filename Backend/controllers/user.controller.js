const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListToken.model');

/**
 * @description Registers a new user in the system
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Promise} Promise resolving to a JSON response of the form { token, user: { fullname, email } }
 * @throws {Error} 400 - If invalid request body is provided
 * @throws {Error} 500 - If there is an error in creating a user
 */

module.exports.registerUser = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { fullname, email, password } = req.body;
	const userAlreadyExists = await userModel.findOne({ email });
	if (userAlreadyExists) {
		return res.status(400).json({ error: 'Captain already exists' });
	}
	const hashedPassword = await userModel.hashPassword(password);

	const user = await userService.createUser({
		firstname: fullname.firstname,
		lastname: fullname.lastname,
		email,
		password: hashedPassword,
	});

	const token = await user.generateAuthToken();
	res.status(201).json({ token, user });
};

/**
 * @description Login a user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Promise} Promise resolving to a JSON response of the form { token, user: { fullname, email } }
 * @throws {Error} 400 - If invalid credentials are provided
 * @throws {Error} 401 - If invalid credentials are provided
 */
module.exports.loginUser = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { email, password } = req.body;

	const user = await userModel.findOne({ email }).select('+password');
	if (!user) {
		return res.status(401).json({ error: 'Invalid credentials' });
	}

	const isMatch = await user.comparePassword(password);
	if (!isMatch) {
		return res.status(401).json({ error: 'Invalid credentials' });
	}
	const token = await user.generateAuthToken();
	res.cookie('token', token);
	res.status(200).json({ token, user });
};

/**
 * @description Gets the profile of a user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Promise} Promise resolving to a JSON response of the form { user: { fullname, email } }
 */
module.exports.getUserProfile = async (req, res, next) => {
	res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
	const token = req.cookies.token || req.headers.authorization.split(' ')[1];
	await blackListTokenModel.create({ token });
	res.clearCookie('token');
	res.status(200).json({ message: 'Logout successful' });
};
