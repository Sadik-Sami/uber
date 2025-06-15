const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListToken.model');
const captainModel = require('../models/captain.model');

/**
 * Middleware to authenticate a user from a JWT token
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Promise} Promise resolving to the next middleware function if authenticated, otherwise a JSON response of the form { error: 'Unauthorized' }
 * @throws {Error} 401 - If invalid or missing token is provided
 */
module.exports.authUser = async (req, res, next) => {
	const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
  const isBlackListed = await blackListTokenModel.findOne({token: token})
  if (isBlackListed) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await userModel.findById(decoded.id);
		req.user = user;
		return next();
	} catch (err) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
};

/**
 * Middleware to authenticate a captain from a JWT token
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Promise} Promise resolving to the next middleware function if authenticated, otherwise a JSON response of the form { error: 'Unauthorized' }
 * @throws {Error} 401 - If invalid or missing token is provided
 */
module.exports.authCaptain = async (req, res, next) => {
	const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
	const isBlackListed = await blackListTokenModel.findOne({token: token})
	if (isBlackListed) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const captain = await captainModel.findById(decoded.id);
		req.captain = captain;
		return next();
	} catch (err) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
};