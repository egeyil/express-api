import express from 'express';
import {handleGetPosts, handleGetPost, handleUpdatePost, handleDeletePost, handleCreatePost} from '../controllers/post/postController';
import validate from "../middleware/validate";
import protect from "../middleware/protect";
import {CreatePostSchema, UpdatePostSchema} from "../schema/post.schema";

const router = express.Router();

// GET /posts
// POST /posts
router
  .route('/')
  .get(protect, handleGetPosts)
  .post(protect, validate(CreatePostSchema), handleCreatePost);

// GET /posts/:id
// PUT /posts/:id
// DELETE /posts/:id
router
  .route('/:id')
  .get(protect, handleGetPost)
  .put(protect, validate(UpdatePostSchema), handleUpdatePost)
  .delete(protect, handleDeletePost);

export default router;