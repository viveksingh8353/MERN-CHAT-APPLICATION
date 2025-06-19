import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="bg-black/50 backdrop-blur-md border-b border-gray-700 shadow-md text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link
        to="/"
        className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent"
      >
        ChatterBox 💬
      </Link>

      <div className="space-x-6 text-md font-medium">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="hover:text-blue-400 transition duration-300">
              Login
            </Link>
            <Link to="/register" className="hover:text-purple-400 transition duration-300">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/chat" className="hover:text-green-400 transition duration-300">
              Chat
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-500 transition duration-300"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
