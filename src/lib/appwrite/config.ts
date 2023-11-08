import {
  Client, Account, Databases, Storage, Avatars,
} from 'appwrite';
// Build appwrite config.
export const appwriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  url: import.meta.env.VITE_APPWRITE_URL,
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
