import { UsersGridProps } from '@/types';
import UserCard from './UserCard';

function UsersGrid({ users } : UsersGridProps) {
  // No one uses our app :(.
  if (!users || (users?.total <= 0)) {
    return (<p className="text-light-4 mt-10 text-center w-full">No users.</p>);
  }
  // Build component.
  return (
    <ul className="user-grid">
      {users?.documents.map((user) => (
        <UserCard key={user.$id} user={user} />
      ))}
    </ul>
  );
}

export default UsersGrid;
