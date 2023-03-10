import mongoose from 'mongoose';
import {PostDocument} from "./Post.model";

const Schema = mongoose.Schema;

export interface UserInput {
  email: string;
  username: string;
  password: string;
  roles?: {
    User?: number,
    Editor?: number,
    Admin?: number
  };
  posts?: PostDocument[];
  refreshToken?: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<Boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    displayName: {type: String, required: true},
    password: {type: String, required: true},
    roles: {
      User: {
        type: Number,
        default: 2001
      },
      Editor: Number,
      Admin: Number
    },
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
    refreshToken: String
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
