import express from 'express';
import {handleGetPosts, handleGetPost, handleUpdatePost, handleDeletePost, handleCreatePost} from '../controllers/postController';
import validate from "../middleware/validate";
import deserializeUser from "../middleware/deserializeUser";
import { PostSchema } from "../schema/post.schema";

const router = express.Router();

// GET /posts
// POST /posts
router
  .route('/')
  .get(deserializeUser, handleGetPosts)
  .post(deserializeUser, validate(PostSchema), handleCreatePost);

// GET /posts/:id
// PUT /posts/:id
// DELETE /posts/:id
router
  .route('/:id')
  .get(deserializeUser, handleGetPost)
  .patch(deserializeUser, validate(PostSchema), handleUpdatePost)
  .delete(deserializeUser, handleDeletePost);

export default router;