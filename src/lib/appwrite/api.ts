import { ID, Models, Query } from 'appwrite';
import { INewPost, INewUser, IUpdatePost } from '@/types';
import {
  account, appwriteConfig, avatars, databases, storage,
} from './config';

export async function saveUserToDB(user:{
  accountId:string,
  name:string,
  email:string,
  username:string,
  imageUrl:URL,
}) {
  try {
    // Create user.
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      user,
    );
    // Return user.
    return newUser;
  } catch (error) {
    throw new Error('Unable to create new user.');
  }
}

export async function createUserAccount(user:INewUser) {
  try {
    // Create account for the user.
    const newAccount = await account.create(ID.unique(), user.email, user.password, user.name);
    // If account creation failed throw it.
    if (!newAccount) throw new Error('Unable to create an account for a new user.');
    // Create avatar for the new user using his/her initials.
    const avatarUrl = avatars.getInitials(user.name);
    // Save user to app DB.
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });
    // If user creation faile throw it.
    if (!newUser) throw new Error('Unable to save user into the DB.');
    // Return new user.
    return newUser;
  } catch (error) {
    throw new Error('Unable to create new user.');
  }
}

export async function signInAccount(user:{ email:string, password:string }) {
  try {
    // Create user session.
    const session = await account.createEmailSession(user.email, user.password);
    // Return session.
    return session;
  } catch (error) {
    throw new Error('Unable to create session.');
  }
}

export async function getCurrentUser() {
  try {
    // Get account.
    const currentAccount = await account.get();
    // Bail if account was not found.
    if (!currentAccount) throw new Error('Unable to get current account.');
    // Get current user.
    const currentUser = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('accountId', currentAccount.$id)]);
    // Bail if user was not found.
    if (!currentUser) throw new Error('Unable to get current user.');
    // Return first entry for the user.
    return currentUser.documents[0];
  } catch (error) {
    throw new Error('Unable to get current user.');
  }
}

export async function getUserById(userId:string) {
  try {
    // Get post.
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId,
    );
    if (!user) {
      throw new Error('Unable to get user by id.');
    }
    // If we got it, spit it out.
    return user;
  } catch (error) {
    throw new Error('Unable to get user by id');
  }
}

export async function getAllUsers() {
  try {
    // Get current user.
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
    );
    // Bail if user was not found.
    if (!users) throw new Error('Unable to get users.');
    // Return first entry for the user.
    return users;
  } catch (error) {
    throw new Error('Unable to get current users.');
  }
}

export async function signOutAccount() {
  try {
    // End current session.
    const session = await account.deleteSession('current');
    return session;
  } catch (error) {
    throw new Error('Unable to end current session.');
  }
}

export async function uploadFile(file:File) {
  try {
    // Save given file inside our DB.
    const uploadedFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), file);
    return uploadedFile;
  } catch (error) {
    throw new Error('Unable to upload a file');
  }
}

export function getFilePreview(fileId: string) {
  try {
    // Get file preview url.
    const fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, 'center', 100);
    // Bail if failed.
    if (!fileUrl) throw new Error('Unable to get file preview url.');
    // Return file url.
    return fileUrl;
  } catch (error) {
    throw new Error('Unable to get file preview url.');
  }
}

export async function deleteFile(fileId: string) {
  try {
    // Delete given file.
    const fileUrl = await storage.deleteFile(appwriteConfig.storageId, fileId);
    // Retur file url.
    return fileUrl;
  } catch (error) {
    throw new Error('Unable to delete a file.');
  }
}

export async function createPost(post :INewPost) {
  try {
    // Get uploaded file.
    const uploadedFile = await uploadFile(post.file[0]);
    // Throw if upload failed.
    if (!uploadedFile) {
      throw new Error('Unable to upload a file.');
    }
    // Get file preview url.
    const fileUrl = getFilePreview(uploadedFile.$id);
    // If file is broken, delete it from DB and throw.
    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw new Error('Unable to process broken file.');
    }
    // Convert tags into an array.
    const tags = post.tags?.replace(/ /g, '').split(',') ?? [];
    // Inser post into DB.
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags,
      },
    );
    // If post creation was unsuccesful, clear its entry inside DB and throw.
    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw new Error('Unable to create new post.');
    }
    // Retur new post.
    return newPost;
  } catch (error) {
    throw new Error('Unable to create new post.');
  }
}

export async function getRecentPosts() {
  // Get recent posts.
  const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postsCollectionId, [Query.orderDesc('$createdAt'), Query.limit(20)]);
  // If posts are missing throw.
  if (!posts) {
    throw new Error('Unable to retrieve recent posts.');
  }
  // Return posts.
  return posts;
}

export async function getUserPosts(user:Models.Document | undefined) {
  // Get recent posts.;
  if (!user) {
    throw new Error('No user.');
  }
  // If posts are missing throw.
  if (!user.posts) {
    throw new Error('Unable to retrieve user posts.');
  }
  // Return posts.
  return user.posts;
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    // Update likes record of given post.
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray,
      },
    );
    // If there is not liked post, throw.
    if (!updatedPost) throw new Error('Unable to like a post');
    // Return liked post.
    return updatedPost;
  } catch (error) {
    throw new Error('Unable to like a post');
  }
}

export async function savePost(postId: string, userId:string | undefined) {
  try {
    // Update likes record of given post.
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      },
    );
    // If there is not liked post, throw.
    if (!updatedPost) throw new Error('Unable to save a post');
    // Return liked post.
    return updatedPost;
  } catch (error) {
    throw new Error('Unable to save a post');
  }
}

export async function deleteSavedPost(savedId:string) {
  try {
    // Update likes record of given post.
    const updatedPost = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedId,
    );
    // If there is not liked post, throw.
    if (!updatedPost) throw new Error('Unable to remove post from the saves');
    // Return liked post.
    return updatedPost;
  } catch (error) {
    throw new Error('Unable to remove post from the saves');
  }
}

export async function getPostById(postId:string) {
  try {
    // Get post.
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
    );
    if (!post) {
      throw new Error('Unable to get post by id.');
    }
    // If we got it, spit it out.
    return post;
  } catch (error) {
    throw new Error('Unable to get post by id');
  }
}

export async function updatePost(post :IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Get uploaded file.
      const uploadedFile = await uploadFile(post.file[0]);
      // Throw if upload failed.
      if (!uploadedFile) {
        throw new Error('Unable to upload a file.');
      }
      // Get file preview url.
      const fileUrl = getFilePreview(uploadedFile.$id);
      // If file is broken, delete it from DB and throw.
      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw new Error('Unable to process broken file.');
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }
    // Convert tags into an array.
    const tags = post.tags?.replace(/ /g, '').split(',') ?? [];
    // Inser post into DB.
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags,
      },
    );
    // If post edit was unsuccesful, clear its entry inside DB and throw.
    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw new Error('Unable to perform post update.');
    }
    // Return updated post.
    return updatedPost;
  } catch (error) {
    throw new Error('Unable to perform post edit.');
  }
}

export async function deletePost(postId:string, imageId:string) {
  if (!postId || !imageId) throw new Error('Insufficient data to perform delete action');

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
    );
    return { status: 'ok' };
  } catch (error) {
    throw new Error('Unable to delete post.');
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: string }) {
  const queries = [Query.orderDesc('$updatedAt'), Query.limit(10)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries,
    );
    if (!posts) {
      throw new Error('No posts');
    }
    return posts;
  } catch (error) {
    throw new Error(`Unable to get posts due to: ${error}`);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.search('caption', searchTerm)],
    );
    if (!posts) {
      throw new Error('No posts');
    }
    return posts;
  } catch (error) {
    throw new Error(`Unable to get posts due to: ${error}`);
  }
}

export async function getCurrentUserSavedPosts() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Unable to get current user.');
    }
    const currentUserSavedPosts = currentUser.save.map(
      (savedPost:Models.Document) => savedPost?.post,
    ) ?? [];
    return currentUserSavedPosts;
  } catch (error) {
    throw new Error(`Unable to get posts due to: ${error}`);
  }
}
