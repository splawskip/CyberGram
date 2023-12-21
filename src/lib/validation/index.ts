import * as z from 'zod';

/**
 * Validation schema for user sign-up data.
 */
export const SignUpValidation = z.object({
  username: z.string().min(2, { message: 'Please provide at least two characters.' }).max(50, { message: 'Username cannot be longer than 50 characters.' }),
  name: z.string().min(2, { message: 'Please provide at least two characters.' }).max(50, { message: 'Name cannot be longer than 50 characters.' }),
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});

/**
 * Validation schema for user sign-in data.
 */
export const SignInValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});

/**
 * Validation schema for Post Upload.
 */
export const PostUploadValidation = z.object({
  caption: z.string().min(5).max(2200),
  file: z.custom<File[]>().refine((files:Array<File>) => (files.length > 0), {
    message: 'Photo must be uploaded.',
  }),
  location: z.string().min(2).max(100),
  tags: z.string(),
});

/**
 * Validation schema for User Update.
 */
export const UserUpdateValidation = z.object({
  file: z.custom<File[]>().refine((files:Array<File>) => (files.length > 0), {
    message: 'Photo must be uploaded.',
  }),
  bio: z.string().min(0).max(200),
});
