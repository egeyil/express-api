import mongoose from 'mongoose';

const Schema = mongoose.Schema;
import bcrypt from "bcrypt";
import config from "config";

// const userSchema = new Schema({
//   username: {
//     type: String,
//     required: true
//   },
//   roles: {
//     User: {
//       type: Number,
//       default: 2001
//     },
//     Editor: Number,
//     Admin: Number
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   refreshToken: String
// });
//
// export default mongoose.model('User', userSchema);

export interface UserInput {
  email: string;
  name: string;
  password: string;
  roles?: {
    User?: number,
    Editor?: number,
    Admin?: number
  };
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<Boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true},
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
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
