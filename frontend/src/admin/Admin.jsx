import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { adminApi } from '../utils/api';

const sidebarLinks = [
  { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
  { name: "Products", path: "/admin/products", icon: "🛍️" },
  { name: "Add-Product", path: "/admin/add-product", icon: "➕" },
];

const Admin = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Verify token and get admin user data
    const verifyAdmin = async () => {
      try {
        const response = await adminApi.verifyToken();
        setAdminUser(response.data);
      } catch (error) {
        console.error('Error verifying admin:', error);
        localStorage.removeItem('token');
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await adminApi.logout();
      localStorage.removeItem('token');
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chocolate-700"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <Link to="/">
          <h2 className="md:text-3xl font-semibold text-gray-700 hover:text-chocolate-700 transition duration-300">
            Chocolate Bravo
          </h2>
        </Link>

        {/* Admin Profile with Hover Dropdown */}
        <div className="relative group inline-block">
          <div className="flex items-center gap-4 text-gray-500">
            <p>Hi! {adminUser?.name || 'Admin'}</p>
            <div className="border rounded-full text-sm w-10 h-10 overflow-hidden cursor-pointer">
              <img
                src={adminUser?.avatar || "https://via.placeholder.com/40"}
                alt="Admin Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          {/* Dropdown shown on group hover */}
          <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg w-40 hidden group-hover:flex flex-col z-50">
            <button 
              onClick={() => navigate('/admin/profile')}
              className="px-4 py-2 hover:bg-gray-100 text-left text-gray-700"
            >
              Profile
            </button>
            <hr className="my-0" />
            <button 
              onClick={handleLogout}
              className="px-4 py-2 hover:bg-gray-100 text-left text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar */}
        <aside className="w-full md:w-64 md:h-screen h-auto border-b md:border-b-0 md:border-r border-gray-300 bg-white text-base flex flex-row md:flex-col">
          {sidebarLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center md:py-3 py-2 px-4 gap-2 md:gap-3 transition whitespace-nowrap
                ${
                  isActive
                    ? "border-b-4 md:border-b-0 md:border-r-[6px] bg-gray-100 border-gray-500 text-gray-700 font-semibold"
                    : "hover:bg-gray-100/90 text-gray-700"
                }`
              }
            >
              <span>{item.icon}</span>
              <span className="block">{item.name}</span>
            </NavLink>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin;
