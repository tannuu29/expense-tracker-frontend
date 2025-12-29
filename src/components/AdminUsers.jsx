import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchWithAuth } from "../utils/auth";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'users', 'admins'

  const role = localStorage.getItem("role");

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token")?.trim();

      if (!token) {
        setError("Missing token. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetchWithAuth("http://localhost:80/admin/users", {
          method: "GET",
        });

        if (!res.ok) {
          // Try to surface a helpful message if backend returns JSON
          let message = `Request failed (${res.status})`;
          try {
            const data = await res.json();
            if (data?.message) message = data.message;
          } catch {
            // ignore JSON parse errors
          }
          throw new Error(message);
        }

        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    // Extra safety: page should only ever be reachable via AdminRoute,
    // but this keeps the UI clean if someone renders it directly.
    if (role === "ADMIN") loadUsers();
    else {
      setLoading(false);
      setUsers([]);
      setError("Not authorized.");
    }
  }, [role]);

  // Helper function to normalize role
  const normalizeRole = (role) => {
    if (!role) return "";
    return String(role).toUpperCase().trim();
  };

  // Filter users based on selected filter
  const filteredUsers = users.filter((user) => {
    const userRole = normalizeRole(user?.role);
    if (filter === "users") {
      // Show users (non-admin roles, including empty/null roles)
      return userRole !== "ADMIN";
    } else if (filter === "admins") {
      // Show only admins
      return userRole === "ADMIN";
    }
    return true; // 'all' shows everyone
  });

  // Calculate stats
  const totalUsers = users.filter(
    (u) => normalizeRole(u?.role) !== "ADMIN"
  ).length;
  const totalAdmins = users.filter(
    (u) => normalizeRole(u?.role) === "ADMIN"
  ).length;
  const totalAll = users.length;

  return (
    <div className="admin-users-container">
      <div className="admin-users-content">
        <div className="admin-users-header">
          <h2>Admin Dashboard</h2>

          {/* Stats Cards */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-card-label">Total Users</div>
              <div className="stat-card-value">{totalAll}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Regular Users</div>
              <div className="stat-card-value">{totalUsers}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Admins</div>
              <div className="stat-card-value">{totalAdmins}</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Users ({totalAll})
            </button>
            <button
              className={`filter-tab ${filter === "users" ? "active" : ""}`}
              onClick={() => setFilter("users")}
            >
              Users ({totalUsers})
            </button>
            <button
              className={`filter-tab ${filter === "admins" ? "active" : ""}`}
              onClick={() => setFilter("admins")}
            >
              Admins ({totalAdmins})
            </button>
          </div>
        </div>

        {loading && (
          <div className="loading-state">Loading users…</div>
        )}
        {!loading && error && (
          <div className="error-state">{error}</div>
        )}

        {!loading && !error && (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-state">
                      <div className="empty-state-icon">👥</div>
                      <div>No {filter === "all" ? "" : filter} found.</div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, idx) => {
                    const userRole = normalizeRole(u?.role);
                    const isAdmin = userRole === "ADMIN";
                    return (
                      <tr key={u?.id ?? u?._id ?? idx}>
                        <td>{u?.id ?? u?._id ?? "-"}</td>
                        <td>
                          {u?.username ?? u?.name ?? u?.email ?? "-"}
                        </td>
                        <td>{u?.email ?? "-"}</td>
                        <td>
                          <span
                            className={`role-badge ${
                              isAdmin ? "admin" : "user"
                            }`}
                          >
                            {userRole || "USER"}
                          </span>
                        </td>
                        <td>
                          <Link
                            to={`/admin/users/${u?.id ?? u?._id ?? ""}`}
                            className="view-link"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


