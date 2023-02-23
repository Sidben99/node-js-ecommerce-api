const { Schema, model, default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'you need to enter a username'],
    },
    slug: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'you need to enter the email'],
      unique: [true, 'this email is already used'],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'you need to enter a password'],
      minLength: [6, 'to shoort password'],
    },
    changePasswordAt: {
      type: Date,
    },
    phone: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'manager'],
      default: 'user',
    },
    resetPasswordInfos: {
      code: {
        type: String,
      },
      expiredAt: {
        type: Date,
      },
      verified: {
        type: Boolean,
      },
    },
    wishList: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
    addresses: [
      {
        id: mongoose.Schema.Types.ObjectId,
        alias: String,
        street: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.pre('findOneAndUpdate', async function (next) {
  const updatedDoc = this.getUpdate();
  if (updatedDoc.password)
    updatedDoc.password = await bcrypt.hash(updatedDoc.password, 12);
  next();
});

module.exports = model('User', userSchema);
