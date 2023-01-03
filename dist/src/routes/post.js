"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const validate_1 = __importDefault(require("../middleware/validate"));
const protect_1 = __importDefault(require("../middleware/protect"));
const post_schema_1 = require("../schema/post.schema");
const router = express_1.default.Router();
// GET /posts
// POST /posts
router
    .route('/')
    .get(protect_1.default, postController_1.handleGetPosts)
    .post(protect_1.default, (0, validate_1.default)(post_schema_1.PostSchema), postController_1.handleCreatePost);
// GET /posts/:id
// PUT /posts/:id
// DELETE /posts/:id
router
    .route('/:id')
    .get(protect_1.default, postController_1.handleGetPost)
    .patch(protect_1.default, (0, validate_1.default)(post_schema_1.PostSchema), postController_1.handleUpdatePost)
    .delete(protect_1.default, postController_1.handleDeletePost);
exports.default = router;
//# sourceMappingURL=post.js.map