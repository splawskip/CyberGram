import React from 'react';
import {
  Link, NavLink, useNavigate, useLocation,
} from 'react-router-dom';
import { Button } from '../ui/button';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';
import { sidebarLinks } from '@/constants';
import { INavLink } from '@/types';

function LeftSidebar() {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();
  React.useEffect(() => {
    if (isSuccess) {
      navigate(0);
    }
  }, [navigate, isSuccess]);
  // Build component.
  return (
    <nav className="hidden md:flex px-6 py-10 flex-col justify-between min-w-[270px] bg-dark-2">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            loading="lazy"
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-3 item-center">
          <img loading="lazy" src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="User avatar" className="h-14 w-14 rounded-full" />
          <div className="flex flex-col">
            <p className="body-bold">
              {user.name || 'N0 0N3'}
            </p>
            <p className="small-regular text-light-3">
              @
              {user.username || 'N0 0N3'}
            </p>
          </div>
        </Link>
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link:INavLink) => {
            // Check if we are proccessing a current route.
            const isCurrent = pathname === link.route;
            // Render nav item.
            return (
              <li className={`group ${isCurrent && 'bg-primary-500 text-dark-1'} rounded-lg base-medium hover:bg-primary-500 hover:text-dark-1 transition`} key={link.label}>
                <NavLink to={link.route} className="flex gap-4 item-center p-4">
                  <img loading="lazy" src={link.imgURL} alt={link.label} className={`group-hover:text-dark-1 ${isCurrent && 'text-dark-1'}`} />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button variant="ghost" className="shad-button--transparent" onClick={() => signOut()}>
        <img loading="lazy" src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
}

export default LeftSidebar;
