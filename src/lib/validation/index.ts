import * as z from 'zod';

export const SignUpValidation = z.object({
  username: z.string().min(2, { message: 'Please provide at least two characters.' }).max(50, { message: 'Username cannot be longer than 50 characters.' }),
  name: z.string().min(2, { message: 'Please provide at least two characters.' }).max(50, { message: 'Name cannot be longer than 50 characters.' }),
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});
