const captainModel = require('../models/captain.model');
const blackListTokenModel = require('../models/blackListToken.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');

/**
 * Registers a new captain in the system
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Promise} Promise resolving to a JSON response of the form { token, captain: { fullname, email, vehicle: { color, capacity, plate, vehicleType } } }
 * @throws {Error} 400 - If invalid request body is provided
 * @throws {Error} 500 - If there is an error in creating a captain
 */
module.exports.registerCaptain = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const { fullname, email, password, vehicle } = req.body;
	const captainAlreadyExists = await captainModel.findOne({ email });
	if (captainAlreadyExists) {
		return res.status(400).json({ error: 'Captain already exists' });
	}
	const hashedPassword = await captainModel.hashPassword(password);

	const captain = await captainService.createCaptain({
		firstname: fullname.firstname,
		lastname: fullname.lastname,
		email,
		password: hashedPassword,
		color: vehicle.color,
		capacity: vehicle.capacity,
		plate: vehicle.plate,
		vehicleType: vehicle.vehicleType,
	});
	const token = await captain.generateAuthToken();
	res.status(201).json({ token, captain });
};

/**
 * Logs in a captain in the system
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Promise} Promise resolving to a JSON response of the form { token, captain: { fullname, email, vehicle: { color, capacity, plate, vehicleType } } }
 * @throws {Error} 400 - If invalid request body is provided
 * @throws {Error} 500 - If there is an error in logging in a captain
 */
module.exports.loginCaptain = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const { email, password } = req.body;
	const captain = await captainModel.findOne({ email }).select('+password');
	if (!captain) {
		return res.status(400).json({ error: 'Invalid credentials' });
	}

	const isMatch = await captain.comparePassword(password);
	if (!isMatch) {
		return res.status(400).json({ error: 'Invalid credentials' });
	}
	const token = await captain.generateAuthToken();
	res.cookie('token', token);
	res.status(200).json({ token, captain });
};

/**
 * Gets the profile of a captain
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Promise} Promise resolving to a JSON response of the form { captain: { fullname, email, vehicle: { color, capacity, plate, vehicleType } } }
 */
module.exports.getCaptainProfile = async (req, res, next) => {
	res.status(200).json({ captain: req.captain });
};

/**
 * Logs out a captain from the system
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Promise} Promise resolving to a JSON response of the form { message: 'Logout successful' }
 * @throws {Error} 500 - If there is an error in logging out a captain
 */
module.exports.logoutCaptain = async (req, res, next) => {
	const token = req.cookies.token || req.headers.authorization.split(' ')[1];
	await blackListTokenModel.create({ token });
	res.clearCookie('token');
	res.status(200).json({ message: 'Logout successful' });
};
