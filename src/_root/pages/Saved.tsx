import CyberLoader from '@/components/shared/CyberLoader';
import GridPostList from '@/components/shared/GridPostList';
import { useGetCurrentUserSavedPosts } from '@/lib/react-query/queriesAndMutations';

function Saved() {
  // Get current user saved posts.
  const { data: savedPosts, isPending } = useGetCurrentUserSavedPosts();
  // Build component.
  return (
    <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:p-14 custom-scrollbar">
      <div className="max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9">
        <h2 className="h3-bold md:h2-bold w-full">Posts that you saved</h2>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {isPending && (
          <div className="grid place-items-center w-full h-full">
            <CyberLoader />
          </div>
        )}

        {(!isPending && !savedPosts) && (
          <p className="text-light-4 mt-10 text-center w-full">No posts</p>
        )}

        {!isPending && savedPosts
         && <GridPostList posts={savedPosts} showUser={false} showStats={false} />}
      </div>
    </div>
  );
}

export default Saved;
