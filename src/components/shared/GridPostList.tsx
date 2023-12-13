import { Link } from 'react-router-dom';
import { useUserContext } from '@/context/AuthContext';
import PostStats from './PostStats';
import { GridPostListProps } from '@/types';

const defaultProps: Partial<GridPostListProps> = {
  showUser: true,
  showStats: true,
};

function GridPostList({ posts, showUser = true, showStats = true } : GridPostListProps) {
  const { user } = useUserContext();
  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img loading="lazy" src={post.imageUrl} alt="Post" className="h-full w-full object-cover" />
          </Link>
          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img loading="lazy" src={post.creator.imageUrl} alt="Creator avatar" className="h-8 w-8 rounded-full" />
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}
            {showStats && (<PostStats post={post} userId={user.id} />)}
          </div>
        </li>
      ))}
    </ul>
  );
}

GridPostList.defaultProps = defaultProps;

export default GridPostList;
