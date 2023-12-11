import { useNavigate, useParams } from 'react-router-dom';
import { useGetUserById, useGetUserPosts } from '@/lib/react-query/queriesAndMutations';
import Loader from '@/components/shared/Loader';
import GridPostList from '@/components/shared/GridPostList';

function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();
  if (!id) {
    navigate(-1);
  }
  // Get user by given id.
  const { data: user, isPending: isUserLoading } = useGetUserById(id ?? '');
  // No user? Bail the page.
  if (!user) {
    navigate(-1);
  }
  // Get user posts.
  const { data: posts, isPending: arePostsLoading } = useGetUserPosts(user);
  // Show loader on loading.
  if (isUserLoading) {
    return <Loader />;
  }
  // Build component.
  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex flex-col gap-10">
          <section className="flex items-start justify-between">
            <div className="flex justify-start items-start gap-10">
              <img loading="lazy" src={user?.imageUrl ?? '/assets/icons/profile-placeholder.svg'} alt="User avatar" className="h-40 w-40 rounded-full" />
              <div className="flex flex-col items-start gap-2">
                <h2 className="h3-bold md:h2-bold w-full">
                  {user?.name}
                </h2>
                <p className="small-regular text-light-3">
                  @
                  {user?.username}
                </p>
                <p className="small-medium lg:base-medium">
                  {user?.bio}
                </p>
                <ol>
                  <li>
                    <span className="text-primary-500 font-bold">{user?.posts.length}</span>
                    {' '}
                    Posts
                  </li>
                </ol>
              </div>
            </div>
          </section>
          <h3 className="body-bold md:h3-bold">Posts:</h3>
          {
            posts
            && !arePostsLoading
            && <GridPostList posts={posts} showStats={false} showUser={false} />
          }
        </div>
      </div>
    </div>
  );
}

export default Profile;
