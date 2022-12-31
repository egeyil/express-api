import {Request, Response} from "express";
import {logger} from "../middleware/logEvents";
import Post from "../model/Post.model";

export const handleGetPosts = async (req: Request, res: Response) => {
  try {
    const currentPage = req.query.page ? Number(req.query.page) : 1;
    const perPage = req.query.per_page ? Number(req.query.per_page) : 15;
    const user = res.locals.user;

    const posts = await Post.find({}).sort({createdAt: -1}).skip((currentPage - 1) * perPage).limit(perPage).exec();

    return res.json(posts);
  } catch (e) {
    console.log(e)
    return res.status(500).json({message: "Internal server error"});
  }
}

export const handleGetPost = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const id = req.params.id ? Number(req.params.id) : null;
    if (!id) return res.status(400).json({message: "Invalid post id"});

    const post = await Post.findById(req.params.id).exec();

    if (!post) {
      return res.status(404).json({message: "Post not found"});
    }

    return res.status(200).json(post);
  } catch (e) {
    return res.status(500).json({message: "Internal server error"});
  }
}

export const handleCreatePost = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const {title, content} = req.body;

    if (!title || !content) {
      return res.status(400).json({message: "Invalid post data"});
    }

    const post = await Post.create({title, content});

    return res.status(201).json({message: "Post created successfully.", post: post });
  } catch (e) {
    return res.status(500).json({message: "Internal server error"});
  }
}

export const handleUpdatePost = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const id = req.params.id ? Number(req.params.id) : null;
    const {title, content} = req.body;

    if (!id) return res.status(400).json({message: "Invalid post id"});
    if (!title || !content) return res.status(400).json({message: "Invalid post data"});

    const post = await Post.findByIdAndUpdate(id, {title, content}, {new: true}).exec();

    res.status(200).json({message: "Post updated successfully.", post: post});
  } catch (e) {
    return res.status(500).json({message: "Internal server error"});
  }
}

export const handleDeletePost = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const id = req.params.id ? Number(req.params.id) : null;

    if (!id) return res.status(400).json({message: "Invalid post id"});

    const post = await Post.findByIdAndDelete(id).exec();

    if (!post) {
      return res.status(404).json({message: "Post not found"});
    }

    return res.status(200).json({message: "Post deleted successfully.", post: post});
  } catch (e) {
    return res.status(500).json({message: "Internal server error"});
  }
}