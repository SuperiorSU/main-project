import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const dbconnect = () => {
	mongoose.connect(process.env.MONGO_URI);

	const connection = mongoose.connection;

	connection.once('open', () => {
		console.log('MongoDB database connection established successfully');
	});
}

export default dbconnect;
