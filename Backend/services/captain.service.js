const captainModel = require('../models/captain.model');

/**
 * Creates a new captain in the system
 * @param {Object} data - Captain data
 * @param {string} data.firstname - First name
 * @param {string} data.lastname - Last name
 * @param {string} data.email - Email address
 * @param {string} data.password - Password
 * @param {string} data.color - Vehicle color
 * @param {number} data.capacity - Vehicle capacity
 * @param {string} data.plate - Vehicle plate
 * @param {string} data.vehicleType - Vehicle type
 * @returns {Promise} Captain document
 * @throws {Error} If any of the required fields are not provided
 */
module.exports.createCaptain = async ({ firstname, lastname, email, password, color, capacity, plate, vehicleType }) => {
	if (!firstname || !email || !password || !color || !capacity || !plate || !vehicleType) {
		throw new Error('All fields are required');
	}
	const captain = captainModel.create({
		fullname: {
			firstname,
			lastname,
		},
		email,
		password,
		vehicle: {
			color,
			capacity,
			plate,
			vehicleType,
		},
	});
	return captain;
};
