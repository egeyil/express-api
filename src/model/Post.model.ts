import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface PostInput {
  title: string;
  content: string;
}

export interface PostDocument extends PostInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema(
  {
    title: {type: String, required: true},
    content: {type: String, required: true},
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model<PostDocument>("Post", postSchema);

export default PostModel;
