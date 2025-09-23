import {Outlet} from "react-router"


const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 px-4">
      <Outlet />
    </div>
  );
}

export default AuthLayout