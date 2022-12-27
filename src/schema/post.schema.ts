import {z, TypeOf} from 'zod';

export const PostPayload = {
  body: z.object({
    title: z.string().min(3).max(20),
    content: z.string().min(3).max(3000),
  }),
}

export const PostParams = {
  params: z.object({
    postId: z.string({
      required_error: 'postId is required',
      invalid_type_error: 'postId must be a string',
    }).min(1),
  })
}

export const CreatePostSchema = z.object({
  ...PostPayload,
});

export const UpdatePostSchema = z.object({
  ...PostPayload,
  ...PostParams
});

export const DeletePostSchema = z.object({
  ...PostParams
});

export const GetPostSchema = z.object({
  ...PostParams
});

export type CreateProductInput = TypeOf<typeof CreatePostSchema>;
export type ReadProductInput = TypeOf<typeof GetPostSchema>;
export type UpdateProductInput = TypeOf<typeof UpdatePostSchema>;
export type DeleteProductInput = TypeOf<typeof DeletePostSchema>;





