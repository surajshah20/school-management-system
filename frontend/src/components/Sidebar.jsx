import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white shadow-lg">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-wider">SMS Admin</h1>
      </div>
      
      <div className="flex flex-1 flex-col p-4 space-y-2">
        <Link to="/dashboard" className="rounded-md px-4 py-2 hover:bg-gray-800 transition-colors">
          Overview
        </Link>
        <Link to="/students" className="rounded-md px-4 py-2 hover:bg-gray-800 transition-colors">
          Students
        </Link>
        <Link to="/teachers" className="rounded-md px-4 py-2 hover:bg-gray-800 transition-colors">
          Teachers
        </Link>
      </div>

      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={handleLogout}
          className="w-full rounded-md bg-red-600 px-4 py-2 hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;