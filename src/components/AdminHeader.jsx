import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./AdminHeader.css";

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/admin/login");
  };

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <Link to="/admin/users" className="admin-header-logo">
          MoneyMap Admin
        </Link>

        <nav className="admin-header-nav">
          <NavLink to="/admin/users" className="admin-header-nav-link">
            Users
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="admin-header-logout-btn"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}


