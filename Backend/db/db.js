const mongoose = require('mongoose');

const connectToDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI); // Clean and modern
		console.log(`✅ MongoDB connected: ${conn.connection.host}`);
	} catch (err) {
		console.error('❌ MongoDB connection error:', err.message);
		process.exit(1); // Exit process if DB connection fails
	}
};

mongoose.connection.on('connected', () => {
	console.log('🔌 Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
	console.error('❗ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
	console.warn('⚠️ Mongoose disconnected from DB');
});

process.on('SIGINT', async () => {
	await mongoose.connection.close();
	console.log('📴 Mongoose connection closed due to app termination');
	process.exit(0);
});

module.exports = connectToDB;
