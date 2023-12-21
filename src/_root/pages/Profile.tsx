import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetCurrentUser, useGetUserById, useGetUserPosts } from '@/lib/react-query/queriesAndMutations';
import GridPostList from '@/components/shared/GridPostList';
import CyberButton from '@/components/buttons/CyberButton';
import CyberLoader from '@/components/shared/CyberLoader';

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
  const { data: currentUser } = useGetCurrentUser();
  // Show loader on loading.
  if (isUserLoading) {
    return (
      <div className="grid place-items-center w-full h-full">
        <CyberLoader />
      </div>
    );
  }
  // Build component.
  return (
    <div className="flex flex-col items-center flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 custom-scrollbar">
      <div className="flex items-center md:mb-8 xl:items-start gap-8 flex-col xl:flex-row relative max-w-5xl w-full">
        <div className="flex flex-col gap-10">
          <section className="flex items-start justify-between gap-4">
            <div className="flex justify-start items-start gap-4">
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
                {
                  user?.$id === currentUser?.$id
                && (
                  <Link to={`/update-profile/${user?.$id}`}>
                    <CyberButton>Edit Profile</CyberButton>
                  </Link>
                )
                }
              </div>
            </div>
          </section>
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
