import { Link, useNavigate } from 'react-router-dom';
import { PostCardProps } from '@/types';
import { getRelativeTime } from '@/lib/utils';
import { useUserContext } from '@/context/AuthContext';
import PostStats from './PostStats';
import { Button } from '../ui/button';
import { useDeletePost } from '@/lib/react-query/queriesAndMutations';

function PostCard({ post }:PostCardProps) {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutate: deletePost } = useDeletePost();

  const handleDeletePost = () => {
    deletePost({ postId: post.id ?? '', imageId: post.imageId });
    navigate(-1);
  };
  // Build component.
  return (
    <div className="post-card">
      <div className="flex-between flex-wrap">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img loading="lazy" src={post?.creator?.imageUrl ?? '/assets/icons/profile-placeholder.svg'} className="rounded-full w-12 lg:h-12" alt="Creator avatar" />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">{post.creator.name}</p>
            <div className="flex-start gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">{getRelativeTime(post.$createdAt)}</p>
              -
              <p className="subtle-semibold lg:small-regular">{post.location}</p>
            </div>
          </div>
        </div>

        {user.id === post.creator.$id && (
          <div className="flex justify-end items-center gap-1">
            <Link to={`/update-post/${post.$id}`}>
              <img loading="lazy" src="/assets/icons/edit.svg" alt="Edit icon" width={20} height={20} />
            </Link>
            <Button onClick={handleDeletePost} variant="ghost" className="ghost_details-delete_btn">
              <img loading="lazy" src="/assets/icons/delete.svg" alt="Delete icon" width={24} height={24} />
            </Button>
          </div>
        )}

        <Link to={`/posts/${post.$id}`} className="w-full">
          <div className="small-medium lg:base-medium py-5">
            <p>{post.caption}</p>
            <ul className="flex gap-1 mt-2">
              {post.tags.map((tag:string) => (
                <li key={tag} className="text-light-3">
                  #
                  {tag}
                </li>
              ))}
            </ul>
          </div>
          <img loading="lazy" src={post.imageUrl ?? '/assets/icons/profile-placeholder.svg'} alt="Post content" className="post-card_img" />
        </Link>
      </div>
      <PostStats post={post} userId={user.id} />
    </div>
  );
}

export default PostCard;
