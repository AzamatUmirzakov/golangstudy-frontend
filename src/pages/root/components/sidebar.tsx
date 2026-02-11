import { Link, useLocation, Outlet, useNavigate } from "react-router";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const linkClasses = (path: string) =>
    `p-2 block rounded ${isActive(path) ? "bg-[#00A3FF] text-white" : "text-gray-700 hover:bg-gray-200"}`;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="bg-white border-r border-gray-200 p-4 w-64 overflow-y-auto flex flex-col">
        <div className="border-b-2 border-gray-300 mb-6 pb-4">
          <h2 className="text-gray-800 text-2xl font-bold">University App</h2>
        </div>
        <div className="gap-2 flex flex-col">
          <Link className={linkClasses("/")} to="/">
            Home
          </Link>
          <Link className={linkClasses("/students")} to="/students">
            Students
          </Link>
          <Link className={linkClasses("/courses")} to="/courses">
            Courses
          </Link>
          <Link className={linkClasses("/instructors")} to="/instructors">
            Instructors
          </Link>
        </div>
        <div className="mt-auto">
          <button className="p-2 block rounded bg-[#00A3FF] text-white hover:bg-[#0078CC] w-full cursor-pointer" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className="content bg-gray-50 flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Sidebar;
