import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Input } from '@/components/ui/input';
import SearchResults from '@/components/shared/SearchResults';
import GridPostList from '@/components/shared/GridPostList';
import { useGetPosts, useSearchPosts } from '@/lib/react-query/queriesAndMutations';
import useDebounce from '@/hooks/useDebounce';
import CyberLoader from '@/components/shared/CyberLoader';

function Explore() {
  // Get intersection observer tools.
  const { ref, inView } = useInView();
  // Get data fetching tools.
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();
  // Create stateful variable for current search value.
  const [searchValue, setSearchValue] = React.useState('');
  // Debounce modifications of current search value.
  const debouncedValue = useDebounce(searchValue, 500);
  // Search for requested posts.
  const { data: searchedPosts, isPending: isSearching } = useSearchPosts(debouncedValue);
  // Fetch another piece of posts if our ref is in view.
  React.useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue, fetchNextPage]);
  // Show loader if posts are missing.
  if (!posts) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <CyberLoader />
      </div>
    );
  }
  // Create some logical helpers.
  const shouldShowSearchResults = searchValue !== '';
  const shouldShowPosts = !shouldShowSearchResults
  && posts?.pages.every((item) => item.documents.length === 0);
  // Build component.
  return (
    <div className="flex flex-col flex-1 items-center overflow-scroll py-10 px-5 md:p-14 custom-scrollbar">
      <div className="max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img loading="lazy" src="/assets/icons/search.svg" alt="Search icon" width={24} height={24} />
          <Input type="text" placeholder="Search" className="explore-search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-between items-center w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>
        <div className="flex justify-center items-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img loading="lazy" src="/assets/icons/filter.svg" alt="Filters icon" width={20} height={20} />
        </div>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults && (
          <SearchResults isSearching={isSearching} searchedPosts={searchedPosts} />
        )}

        {shouldShowPosts && !shouldShowSearchResults && (
          <p className="text-light-4 mt-10 text-center w-full">No posts</p>
        )}

        {!shouldShowSearchResults && !shouldShowPosts && posts.pages.map((item) => (
          <GridPostList key={crypto.randomUUID()} posts={item.documents} />
        ))}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <CyberLoader />
        </div>
      )}
    </div>
  );
}

export default Explore;
