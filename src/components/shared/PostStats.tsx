import { Models } from 'appwrite';
import React from 'react';
import {
  useDeleteSavePost, useGetCurrentUser, useLikePost, useSavePost,
} from '@/lib/react-query/queriesAndMutations';
import { checkIsLiked } from '@/lib/utils';
import { PostStatsProps } from '@/types';
import Loader from './Loader';

function PostStats({ post, userId } : PostStatsProps) {
  const likesList = post.likes.map((user:Models.Document) => user.$id);

  const [likes, setLikes] = React.useState(likesList);
  const [isSaved, setIsSaved] = React.useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSaving } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeleting } = useDeleteSavePost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPost = currentUser?.save.find(
    (record:Models.Document) => record.post.$id === post.$id,
  );

  React.useEffect(() => {
    setIsSaved(!!savedPost);
  }, [currentUser, savedPost]);

  const handleLikePost = (event: React.MouseEvent) => {
    event.stopPropagation();
    let newLikes = [...likes];
    if (newLikes.includes(userId)) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }
    setLikes(newLikes);
    likePost({ postId: post.$id, likesArray: newLikes });
  };

  const handleSavePost = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (savedPost) {
      setIsSaved(false);
      deleteSavedPost(savedPost.$id);
    } else {
      setIsSaved(true);
      savePost({ postId: post.$id, userId: currentUser?.$id });
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <button type="button" onClick={handleLikePost}>
          {isSaving || isDeleting ? <Loader /> : <img loading="lazy" src={`/assets/icons/like${checkIsLiked(likes, userId) ? 'd' : ''}.svg`} alt="Like icon" width={20} height={20} className="cursor-pointer" />}
        </button>
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={handleSavePost}>
          {isSaving || isDeleting ? <Loader /> : <img loading="lazy" src={`/assets/icons/save${isSaved ? 'd' : ''}.svg`} alt="Save icon" width={20} height={20} className="cursor-pointer" />}
        </button>
      </div>
    </div>
  );
}

export default PostStats;
