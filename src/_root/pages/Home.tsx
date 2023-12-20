import { Models } from 'appwrite';
import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations';
import PostCard from '@/components/shared/PostCard';
import CyberLoader from '@/components/shared/CyberLoader';

function Home() {
  // Get recent posts.
  const { data: posts, isPending: isPostLoading } = useGetRecentPosts();
  // Build component.
  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        <div className="max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9">
          <h2 className="h3-bold md:h2 text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (<CyberLoader />) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post:Models.Document) => (
                <PostCard key={post.$id} post={post} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
