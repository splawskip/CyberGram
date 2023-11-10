import {
  useMutation,
} from '@tanstack/react-query';
import { createUserAccount, signInAccount, signOutAccount } from '../appwrite/api';
import { INewUser } from '@/types';

export const useCreateUserAccount = () => useMutation({
  mutationFn: (user: INewUser) => createUserAccount(user),
});

export const useSignInAccount = () => useMutation({
  mutationFn: (user: { email:string, password: string }) => signInAccount(user),
});

export const useSignOutAccount = () => useMutation({
  mutationFn: signOutAccount,
});
