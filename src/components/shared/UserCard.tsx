import { Link } from 'react-router-dom';
import { UserCardProps } from '@/types';

function UserCard({ user } : UserCardProps) {
  // Build component.
  return (
    <Link key={user.$id} to={`/profile/${user.$id}`}>
      <li className="flex justify-center items-center flex-col gap-4 border border-dark-4 rounded-[20px] px-5 py-8">
        <img loading="lazy" src={user.imageUrl ?? '/assets/icons/profile-placeholder.svg'} alt="User avatar" className="h-14 w-14 rounded-full" />
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="body-bold">
            {user.name}
          </p>
          <p className="small-regular text-light-3">
            @
            {user.username}
          </p>
        </div>
      </li>
    </Link>
  );
}

export default UserCard;
