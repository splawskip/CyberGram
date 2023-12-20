import { useParams } from 'react-router-dom';
import PostForm from '@/components/forms/PostForm';
import { useGetPostById } from '@/lib/react-query/queriesAndMutations';
import CyberLoader from '@/components/shared/CyberLoader';

function EditPost() {
  // Get id.
  const { id } = useParams();
  // Get post by id.
  const { data: post, isPending } = useGetPostById(id ?? '');
  // Show loader if not yet loaded.
  if (isPending) {
    return (
      <div className="grid place-items-center w-full h-full">
        <CyberLoader />
      </div>
    );
  }
  // Build component.
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex justify-between items-center gap-3 justify-start w-full">
          <img loading="lazy" src="/assets/icons/add-post.svg" width={36} height={36} alt="Add post icon" />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>
        <PostForm action="Update" post={post} />
      </div>
    </div>
  );
}

export default EditPost;
