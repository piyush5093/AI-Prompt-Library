import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-prompt-library';
  await mongoose.connect(uri);
};
