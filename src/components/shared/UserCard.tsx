import { Link } from 'react-router-dom';
import { Models } from 'appwrite';
import { Button } from '@/components/ui/button';

type UserCardProps = {
  user: Models.Document
};

function UserCard({ user } : UserCardProps) {
  return (
    <Link key={user.$id} to={`/profile/${user.$id}`}>
      <li className="user-card">
        <img loading="lazy" src={user.imageUrl ?? '/assets/icons/profile-placeholder.svg'} alt="User avatar" className="h-14 w-14 rounded-full" />
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="body-bold">
            {user.name}
          </p>
          <p className="small-regular text-light-3">
            @
            {user.username}
          </p>
          <Button className="shad-button_primary mt-2">Follow</Button>
        </div>
      </li>
    </Link>
  );
}

export default UserCard;
