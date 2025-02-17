import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    try{
        const dbURI = process.env.DATABASE_URL || '';
        if(!dbURI) throw new Error('Database URI not found');
        

        await mongoose.connect(dbURI);
        console.log('MongoDB connected');
    } catch(err){
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

export default connectDB;