import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetPostById, useDeletePost } from '@/lib/react-query/queriesAndMutations';
import { getRelativeTime } from '@/lib/utils';
import { useUserContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import PostStats from '@/components/shared/PostStats';
import CyberLoader from '@/components/shared/CyberLoader';

function PostDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();
  const { data: post, isPending } = useGetPostById(id ?? '');
  const { mutate: deletePost } = useDeletePost();
  const handleDeletePost = () => {
    deletePost({ postId: id ?? '', imageId: post?.imageId });
    navigate(-1);
  };
  // Build component.
  return (
    <div className="flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 custom-scrollbar items-center">
      {isPending ? <CyberLoader /> : (
        <div className="bg-dark-2 w-full max-w-5xl rounded-[30px] flex-col flex xl:flex-row border border-dark-4 xl:rounded-l-[24px]">
          <img loading="lazy" src={post?.imageUrl} alt="Post" className="h-80 lg:h-[480px] xl:w-[48%] rounded-t-[30px] xl:rounded-l-[24px] xl:rounded-tr-none object-cover p-5 bg-dark-1" />
          <div className="bg-dark-2 flex flex-col gap-5 lg:gap-7 flex-1 items-start p-8 rounded-[30px]">
            <div className="flex justify-between items-center w-full">
              <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
                <img loading="lazy" src={post?.creator?.imageUrl ?? '/assets/icons/profile-placeholder.svg'} className="rounded-full w-8 h-8 lg:h-12 lg:w-12" alt="Creator avatar" />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">{post?.creator.name}</p>
                  <div className="flex justify-between items-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">{getRelativeTime(post?.$createdAt ?? '')}</p>
                    -
                    <p className="subtle-semibold lg:small-regular">{post?.location}</p>
                  </div>
                </div>
              </Link>
              {user.id === post?.creator.$id && (
                <div className="flex justify-center items-center gap-1">
                  <Link to={`/update-post/${post?.$id}`}>
                    <img loading="lazy" src="/assets/icons/edit.svg" alt="Edit icon" width={24} height={24} />
                  </Link>
                  <Button onClick={handleDeletePost} variant="ghost" className="ghost_details-delete_btn">
                    <img loading="lazy" src="/assets/icons/delete.svg" alt="Delete icon" width={24} height={24} />
                  </Button>
                </div>
              )}
            </div>
            <hr className="border w-full border-dark-4/80" />
            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 flex-wrap mt-2">
                {post?.tags.map((tag:string) => (
                  <li key={tag} className="text-light-3">
                    #
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full">
              <PostStats
                post={post ?? {
                  $id: '',
                  $collectionId: '',
                  $databaseId: '',
                  $createdAt: '',
                  $updatedAt: '',
                  $permissions: [],
                }}
                userId={user.id}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostDetails;
