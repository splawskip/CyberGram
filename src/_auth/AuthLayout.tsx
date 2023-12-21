import { Outlet, Navigate } from 'react-router-dom';

function AuthLayout() {
  const isAuthenticated = false;
  // Build component.
  return (
    <>
      {isAuthenticated ? <Navigate to="/" /> : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col">
            <Outlet />
          </section>

          <img loading="lazy" src="/assets/images/side-img.webp" alt="logo" className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat" />
        </>
      )}
    </>
  );
}

export default AuthLayout;
