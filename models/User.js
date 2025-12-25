import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletAddress: { type: String, required: true, unique: true },
});

// JWT TOKEN
UserSchema.methods.getJWTToken = function () {
  console.log('SIGN SECRET:', process.env.JWT_SECRET);

  return jwt.sign(
    { id: this._id, walletAddress: this.walletAddress },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

export const User = mongoose.model('User', UserSchema);
