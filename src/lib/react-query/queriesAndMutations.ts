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
  updateUser,
} from '../appwrite/api';
import {
  INewPost, INewUser, IUpdatePost, IUpdateUser,
} from '@/types';
import { QUERY_KEYS } from './queryKeys';

/**
 * Custom hook for creating a new user account.
 *
 * @returns An object with the mutation function for creating a user account.
 */
export const useCreateUserAccount = () => useMutation({
  mutationFn: (user: INewUser) => createUserAccount(user),
});

/**
 * Custom hook for signing in to a user account.
 *
 * @returns An object with the mutation function for signing in.
 */
export const useSignInAccount = () => useMutation({
  mutationFn: (user: { email:string, password: string }) => signInAccount(user),
});

/**
 * Custom hook for signing out of the current user's account.
 *
 * @returns An object with the mutation function for signing out.
 */
export const useSignOutAccount = () => useMutation({
  mutationFn: signOutAccount,
});

/**
 * Custom hook for creating a new post.
 *
 * @returns An object with the mutation function for creating a post.
 */
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

/**
 * Custom hook for getting recent posts.
 * @returns An object with the query function for getting recent posts.
 */
export const useGetRecentPosts = () => useQuery({
  queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
  queryFn: getRecentPosts,
});

/**
 * Custom hook for liking a post.
 *
 * @returns An object with the mutation function for liking a post.
 */
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

/**
 * Custom hook for saving a post.
 *
 * @returns An object with the mutation function for saving a post.
 */
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

/**
 * Custom hook for deleting a saved post.
 *
 * @returns An object with the mutation function for deleting a saved post.
 */
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

/**
 * Custom hook for getting the current user.
 *
 * @returns An object with the query function for getting the current user.
 */
export const useGetCurrentUser = () => useQuery({
  queryKey: [QUERY_KEYS.GET_CURRENT_USER],
  queryFn: getCurrentUser,
});

/**
 * Custom hook for getting all users.
 *
 * @returns An object with the query function for getting all users.
 */
export const useGetAllUsers = () => useQuery({
  queryKey: [QUERY_KEYS.GET_USERS],
  queryFn: getAllUsers,
});

/**
 * Custom hook for getting a post by its ID.
 *
 * @param postId - The ID of the post.
 * @returns An object with the query function for getting a post by ID.
 */
export const useGetPostById = (postId:string) => useQuery({
  queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
  queryFn: () => getPostById(postId),
  enabled: !!postId,
});

/**
 * Custom hook for getting posts by a specific user.
 *
 * @param user - The user document.
 * @returns An object with the query function for getting posts by user.
 */
export const useGetUserPosts = (user:Models.Document | undefined) => useQuery({
  queryKey: [QUERY_KEYS.GET_USER_POSTS, user],
  queryFn: () => getUserPosts(user),
  enabled: !!user,
});

/**
 * Custom hook for getting a user by their ID.
 *
 * @param userId - The ID of the user.
 * @returns An object with the query function for getting a user by ID.
 */
export const useGetUserById = (userId:string) => useQuery({
  queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
  queryFn: () => getUserById(userId),
  enabled: !!userId,
});

/**
 * Custom hook for updating a post.
 *
 * @returns An object with the mutation function for updating a post.
 */
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

/**
 * Custom hook for updating a post.
 *
 * @returns An object with the mutation function for updating a post.
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user:IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS],
      });
    },
  });
};

/**
 * Custom hook for deleting a post.
 *
 * @returns An object with the mutation function for deleting a post.
 */
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

/**
 * Custom hook for getting infinite posts.
 *
 * @returns An object with the infinite query function for getting posts.
 */
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

/**
 * Custom hook for getting the current user's saved posts.
 *
 * @returns An object with the query function for getting saved posts.
 */
export const useGetCurrentUserSavedPosts = () => useQuery({
  queryKey: [QUERY_KEYS.GET_CURRENT_USER_SAVED_POSTS],
  queryFn: getCurrentUserSavedPosts,
});

/**
 * Custom hook for searching posts based on a search term.
 *
 * @param searchTerm - The term to search for in posts.
 * @returns An object with the query function for searching posts.
 */
export const useSearchPosts = (searchTerm:string) => useQuery({
  queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
  queryFn: () => searchPosts(searchTerm),
  enabled: !!searchTerm,
});
