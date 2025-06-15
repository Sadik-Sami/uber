const captainModel = require('../models/captain.model');
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

module.exports.loginCaptain = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
};

module.exports.getCaptainProfile = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
};

module.exports.logoutCaptain = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
};
