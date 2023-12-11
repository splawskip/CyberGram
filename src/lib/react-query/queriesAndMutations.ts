import {
  useInfiniteQuery,
  useMutation, useQuery, useQueryClient,
} from '@tanstack/react-query';
import { Models } from 'appwrite';
import {
  createPost,
  createUserAccount,
  deleteSavedPost,
  getCurrentUser,
  getPostById,
  getRecentPosts,
  likePost,
  savePost,
  signInAccount,
  signOutAccount,
  updatePost,
  deletePost,
  getInfinitePosts,
  searchPosts,
  getAllUsers,
  getCurrentUserSavedPosts,
  getUserById,
  getUserPosts,
} from '../appwrite/api';
import { INewPost, INewUser, IUpdatePost } from '@/types';
import { QUERY_KEYS } from './queryKeys';

export const useCreateUserAccount = () => useMutation({
  mutationFn: (user: INewUser) => createUserAccount(user),
});

export const useSignInAccount = () => useMutation({
  mutationFn: (user: { email:string, password: string }) => signInAccount(user),
});

export const useSignOutAccount = () => useMutation({
  mutationFn: signOutAccount,
});

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post:INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetRecentPosts = () => useQuery({
  queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
  queryFn: getRecentPosts,
});

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, likesArray }
    : { postId:string, likesArray:string[] }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }
    : { postId:string, userId:string | undefined }) => savePost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedId:string) => deleteSavedPost(savedId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetCurrentUser = () => useQuery({
  queryKey: [QUERY_KEYS.GET_CURRENT_USER],
  queryFn: getCurrentUser,
});

export const useGetAllUsers = () => useQuery({
  queryKey: [QUERY_KEYS.GET_USERS],
  queryFn: getAllUsers,
});

export const useGetPostById = (postId:string) => useQuery({
  queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
  queryFn: () => getPostById(postId),
  enabled: !!postId,
});

export const useGetUserPosts = (user:Models.Document | undefined) => useQuery({
  queryKey: [QUERY_KEYS.GET_USER_POSTS, user],
  queryFn: () => getUserPosts(user),
  enabled: !!user,
});

export const useGetUserById = (userId:string) => useQuery({
  queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
  queryFn: () => getUserById(userId),
  enabled: !!userId,
});

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post:IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, imageId } :
    { postId: string, imageId:string }) => deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetPosts = () => useInfiniteQuery({
  queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
  queryFn: getInfinitePosts,
  initialPageParam: '',
  getNextPageParam: (lastPage) => {
    // If we got nothing return empty string.
    if (lastPage && lastPage.documents.length === 0) {
      return null;
    }
    // Get id of last page.
    const lastId:string = lastPage.documents[(lastPage.documents).length - 1].$id;
    // Return.
    return lastId;
  },
});

export const useGetCurrentUserSavedPosts = () => useQuery({
  queryKey: [QUERY_KEYS.GET_CURRENT_USER_SAVED_POSTS],
  queryFn: getCurrentUserSavedPosts,
});

export const useSearchPosts = (searchTerm:string) => useQuery({
  queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
  queryFn: () => searchPosts(searchTerm),
  enabled: !!searchTerm,
});
