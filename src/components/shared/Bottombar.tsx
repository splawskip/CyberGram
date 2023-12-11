import { useLocation, NavLink } from 'react-router-dom';
import { bottombarLinks } from '@/constants';
import { INavLink } from '@/types';

function Bottombar() {
  // Get current path.
  const { pathname } = useLocation();
  // Build component.
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link:INavLink) => {
        // Check if we are proccessing a current route.
        const isCurrent = pathname === link.route;
        // Render nav item.
        return (
          <NavLink key={link.label} to={link.route} className={`flex-center flex-col gap-1 p-2 transition ${isCurrent && 'bg-primary-500 rounded-[10px]'}`}>
            <img loading="lazy" src={link.imgURL} alt={link.label} width={16} height={16} className={`${isCurrent && 'invert-white'}`} />
            <p className="tiny-medium text-light-2">{link.label}</p>
          </NavLink>
        );
      })}
    </section>
  );
}

export default Bottombar;
