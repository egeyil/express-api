"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostSchema = exports.DeletePostSchema = exports.UpdatePostSchema = exports.CreatePostSchema = exports.PostSchema = exports.PostParams = exports.PostPayload = void 0;
const zod_1 = require("zod");
exports.PostPayload = {
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).max(20),
        content: zod_1.z.string().min(3).max(3000),
    }),
};
exports.PostParams = {
    params: zod_1.z.object({
        postId: zod_1.z.string({
            required_error: 'postId is required',
            invalid_type_error: 'postId must be a string',
        }).min(1),
    })
};
exports.PostSchema = zod_1.z.object(Object.assign(Object.assign({}, exports.PostPayload), exports.PostParams));
exports.CreatePostSchema = zod_1.z.object(Object.assign({}, exports.PostPayload));
exports.UpdatePostSchema = zod_1.z.object(Object.assign(Object.assign({}, exports.PostPayload), exports.PostParams));
exports.DeletePostSchema = zod_1.z.object(Object.assign({}, exports.PostParams));
exports.GetPostSchema = zod_1.z.object(Object.assign({}, exports.PostParams));
//# sourceMappingURL=post.schema.js.map