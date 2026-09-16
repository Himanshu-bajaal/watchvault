const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // hides password from query results by default — must opt in with .select('+password')
    },
  },
  {
    timestamps: true, // auto-adds and manages createdAt / updatedAt
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;