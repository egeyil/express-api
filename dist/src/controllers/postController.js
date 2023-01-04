"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeletePost = exports.handleUpdatePost = exports.handleCreatePost = exports.handleGetPost = exports.handleGetPosts = void 0;
const Post_model_1 = __importDefault(require("../model/Post.model"));
const handleGetPosts = async (req, res) => {
    try {
        const user = res.locals.user;
        const currentPage = req.query.page ? Number(req.query.page) : 1;
        const perPage = req.query.per_page ? Number(req.query.per_page) : 15;
        const posts = await Post_model_1.default.find({}).sort({ createdAt: -1 }).skip((currentPage - 1) * perPage).limit(perPage).exec();
        return res.json({ user, posts });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.handleGetPosts = handleGetPosts;
const handleGetPost = async (req, res) => {
    try {
        const user = res.locals.user;
        const id = req.params.id ? req.params.id : null;
        if (!id)
            return res.status(400).json({ message: "Invalid post id" });
        const post = await Post_model_1.default.findById(id).exec();
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json({ post, user });
    }
    catch (e) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.handleGetPost = handleGetPost;
const handleCreatePost = async (req, res) => {
    try {
        const user = res.locals.user;
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Invalid post data" });
        }
        const post = await Post_model_1.default.create({ title, content });
        return res.status(201).json({ message: "Post created successfully.", user, post });
    }
    catch (e) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.handleCreatePost = handleCreatePost;
const handleUpdatePost = async (req, res) => {
    try {
        const user = res.locals.user;
        const id = req.params.id ? req.params.id : null;
        const { title, content } = req.body;
        if (!id)
            return res.status(400).json({ message: "Invalid post id" });
        if (!title && !content)
            return res.status(400).json({ message: "Invalid post data" });
        const post = await Post_model_1.default.findByIdAndUpdate(id, { title, content }, { new: true }).exec();
        res.status(200).json({ message: "Post updated successfully.", user, post });
    }
    catch (e) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.handleUpdatePost = handleUpdatePost;
const handleDeletePost = async (req, res) => {
    try {
        const user = res.locals.user;
        const id = req.params.id ? req.params.id : null;
        if (!id)
            return res.status(400).json({ message: "Invalid post id" });
        const post = await Post_model_1.default.findByIdAndDelete(id).exec();
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json({ message: "Post deleted successfully.", user, post });
    }
    catch (e) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.handleDeletePost = handleDeletePost;
//# sourceMappingURL=postController.js.map