import { Models } from 'appwrite';
import Loader from './Loader';
import GridPostList from './GridPostList';

type SearchResultsProps = {
  isSearching: boolean,
  searchedPosts: Models.DocumentList<Models.Document> | undefined,
};

function SearchResults({ isSearching, searchedPosts } : SearchResultsProps) {
  // Show the loader.
  if (isSearching) return <Loader />;
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
