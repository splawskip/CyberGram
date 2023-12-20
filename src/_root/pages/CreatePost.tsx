import PostForm from '@/components/forms/PostForm';

function CreatePost() {
  // Build component.
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex justify-between items-center gap-3 justify-start w-full">
          <img loading="lazy" src="/assets/icons/add-post.svg" width={36} height={36} alt="Add post icon" />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>
        <PostForm action="Create" />
      </div>
    </div>
  );
}

export default CreatePost;
