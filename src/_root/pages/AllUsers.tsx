import Loader from '@/components/shared/Loader';
import { useGetAllUsers } from '@/lib/react-query/queriesAndMutations';
import UsersGrid from '@/components/shared/UsersGrid';

function AllUsers() {
  // Get users.
  const { data: users, isPending } = useGetAllUsers();
  // Build component.
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="user-container">
          <h2 className="h3-bold md:h2-bold w-full">Find other creators</h2>
          {
            isPending && (
              <div className="flex-center w-full h-full">
                <Loader />
              </div>
            )
          }
          {
            !isPending
            && (!users || (users.total ?? 0) <= 0)
            && <p className="text-light-4 mt-10 text-center w-full">No users.</p>
          }
          {
            !isPending
            && users
            && users.total > 0
            && <UsersGrid users={users} />
          }
        </div>
      </div>
    </div>
  );
}

export default AllUsers;
