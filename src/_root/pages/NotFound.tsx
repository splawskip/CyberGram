import { Link } from 'react-router-dom';
import CyberButton from '@/components/buttons/CyberButton';

export default function NotFound() {
  // Build component.
  return (
    <div className="h-screen w-full grid place-items-center">
      <div className="common-container h-full w-full flex flex-col justify-center items-center gap-4">
        <h1 className="h1-bold text-center">Oops! You seem to be lost.</h1>
        <Link to="/">
          <CyberButton>Take way home.</CyberButton>
        </Link>
      </div>
    </div>
  );
}
