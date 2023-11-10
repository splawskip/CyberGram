import {
  Client, Account, Databases, Storage, Avatars,
} from 'appwrite';
// Build appwrite config.
export const appwriteConfig = {
  // General.
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  url: import.meta.env.VITE_APPWRITE_URL,
  // Storage.
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  // Collections.
  usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  postsCollectionId: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
};
// Initialize Client.
export const client = new Client()
  .setProject(appwriteConfig.projectId)
  .setEndpoint(appwriteConfig.url);
// Intialize Account.
export const account = new Account(client);
// Intialize Databases.
export const databases = new Databases(client);
// Intialize Storage.
export const storage = new Storage(client);
// Initialize Avatars.
export const avatars = new Avatars(client);
