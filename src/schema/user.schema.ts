import { z } from 'zod';
import { PostSchema } from './post.schema';

export const UserSchema = z.object({
  username: z.string().trim().min(3).max(20),
  displayName: z.string().min(3).max(20),
  password: z.string().trim().min(6).max(25),
  email: z.string().email().trim(),
  roles: z.object({
    User: z.number().min(0).max(7000),
    Editor: z.number().min(0).max(7000),
    Admin: z.number().min(0).max(7000),
  }),
  posts: z.array(PostSchema).optional(),
});

