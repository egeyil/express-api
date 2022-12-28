import {z} from 'zod';
import {PostSchema} from './post.schema';

export const UserSchema = {
  body: z.object({
    username: z.string().trim().min(3).max(20),
    displayName: z.string().min(3).max(20),
    password: z.string().trim().min(6).max(25),
    email: z.string().email().trim(),
    roles: z.object({
      User: z.number().min(0).max(7000),
      Editor: z.number().min(0).max(7000),
      Admin: z.number().min(0).max(7000),
    }).optional(),
    posts: z.array(PostSchema).optional(),
  }),
};

export const LoginSchema = z.object({
  body: z.object({
    username: z.string().trim().min(3).max(20).optional(),
    email: z.string().email().trim().optional(),
    password: z.string().trim().min(6).max(25),
  }),
});

export const RegisterSchema = z.object({
  ...UserSchema,
})


