import GridPostList from './GridPostList';
import { SearchResultsProps } from '@/types';
import CyberLoader from './CyberLoader';

function SearchResults({ isSearching, searchedPosts } : SearchResultsProps) {
  // Show the loader.
  if (isSearching) {
    return (
      <div className="w-full h-full grid place-items-center">
        <CyberLoader />
      </div>
    );
  }
  // Show no results note.
  if (searchedPosts?.total && searchedPosts?.total <= 0) {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results.</p>
    );
  }
  // Show search results.
  return (<GridPostList posts={searchedPosts?.documents} />);
}

export default SearchResults;
