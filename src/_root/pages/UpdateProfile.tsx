import ProfileForm from '@/components/forms/ProfileForm';
import { useUserContext } from '@/context/AuthContext';

function UpdateProfile() {
  const { user } = useUserContext();
  // Build component.
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img loading="lazy" src="/assets/icons/edit.svg" width={36} height={36} alt="Edit profile icon" />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}

export default UpdateProfile;
