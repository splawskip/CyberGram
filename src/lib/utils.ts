import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges class names using the `clsx` and `twMerge` utilities.
 *
 * @param inputs - An array of class values to be combined.
 * @returns A string representing the merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates and returns the relative time elapsed since a given timestamp.
 *
 * @param timestamp - The timestamp to calculate relative time from.
 * @returns A string indicating the relative time.
 */
export function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
  // Resolve relative time.
  if (secondsAgo < 5) {
    return 'just now';
  } if (secondsAgo < 60) {
    return `${secondsAgo} second${secondsAgo === 1 ? '' : 's'} ago`;
  } if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
  } if (secondsAgo < 86400) {
    const hoursAgo = Math.floor(secondsAgo / 3600);
    return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
  } if (secondsAgo < 2592000) {
    const daysAgo = Math.floor(secondsAgo / 86400);
    return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
  } if (secondsAgo < 31536000) {
    const monthsAgo = Math.floor(secondsAgo / 2592000);
    return `${monthsAgo} month${monthsAgo === 1 ? '' : 's'} ago`;
  }
  const yearsAgo = Math.floor(secondsAgo / 31536000);
  return `${yearsAgo} year${yearsAgo === 1 ? '' : 's'} ago`;
}

/**
 * Checks if a user is included in the list of likes.
 *
 * @param likeList - Array of user IDs who liked an item.
 * @param userId - The user ID to check for in the like list.
 * @returns A boolean indicating whether the user has liked the item.
 */
export const checkIsLiked = (likeList: string[], userId: string) => likeList.includes(userId);
