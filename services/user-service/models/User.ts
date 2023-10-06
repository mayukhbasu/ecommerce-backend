import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
};

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String
});



UserSchema.pre<IUser>('save', async function (next) {
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default mongoose.model<IUser>('User', UserSchema);