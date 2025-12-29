import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuth, API_BASE_URL } from "../utils/auth";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'users', 'admins'
  const [stats, setStats] = useState({
    totalUsers: 0,
    regularUsers: 0,
    totalAdmins: 0,
  });

  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  // Check role-based access
  useEffect(() => {
    if (role !== "ADMIN") {
      navigate("/dashboard");
      return;
    }
  }, [role, navigate]);

  // Load dashboard stats
  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/admin/dashboard/stats`, {
          method: "GET",
        });

        if (res.status === 401 || res.status === 403) {
          setError("Unauthorized. Please login again.");
          return;
        }

        if (!res.ok) {
          let message = `Failed to load stats (${res.status})`;
          try {
            const data = await res.json();
            if (data?.message) message = data.message;
          } catch {
            // ignore JSON parse errors
          }
          throw new Error(message);
        }

        const data = await res.json();
        setStats({
          totalUsers: data?.totalUsers ?? 0,
          regularUsers: data?.regularUsers ?? data?.onlyUsers ?? 0,
          totalAdmins: data?.totalAdmins ?? 0,
        });
      } catch (e) {
        console.error("Error loading stats:", e);
        // Don't set error for stats, just use defaults
      }
    }

    if (role === "ADMIN") {
      loadStats();
    }
  }, [role]);

  // Load users and admins based on filter
  useEffect(() => {
    async function loadData() {
      if (role !== "ADMIN") {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token")?.trim();

      if (!token) {
        setError("Missing token. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        // Load data based on filter
        if (filter === "admins") {
          // Load only admins
          const res = await fetchWithAuth(`${API_BASE_URL}/admin/admins`, {
            method: "GET",
          });

          if (res.status === 401 || res.status === 403) {
            setError("Unauthorized. Please login again.");
            setLoading(false);
            return;
          }

          if (!res.ok) {
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
          setAdmins(Array.isArray(data) ? data : []);
          setUsers([]);
        } else if (filter === "users") {
          // Load only users
          const res = await fetchWithAuth(`${API_BASE_URL}/admin/onlyUsers`, {
            method: "GET",
          });

          if (res.status === 401 || res.status === 403) {
            setError("Unauthorized. Please login again.");
            setLoading(false);
            return;
          }

          if (!res.ok) {
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
          setAdmins([]);
        } else {
          // Load all users (combine admins and users)
          const [usersRes, adminsRes] = await Promise.all([
            fetchWithAuth(`${API_BASE_URL}/admin/onlyUsers`, {
              method: "GET",
            }),
            fetchWithAuth(`${API_BASE_URL}/admin/admins`, {
              method: "GET",
            }),
          ]);

          if (usersRes.status === 401 || usersRes.status === 403 || 
              adminsRes.status === 401 || adminsRes.status === 403) {
            setError("Unauthorized. Please login again.");
            setLoading(false);
            return;
          }

          if (!usersRes.ok || !adminsRes.ok) {
            let message = `Request failed`;
            try {
              const usersData = await usersRes.json().catch(() => null);
              const adminsData = await adminsRes.json().catch(() => null);
              if (usersData?.message) message = usersData.message;
              else if (adminsData?.message) message = adminsData.message;
            } catch {
              // ignore JSON parse errors
            }
            throw new Error(message);
          }

          const usersData = await usersRes.json();
          const adminsData = await adminsRes.json();
          setUsers(Array.isArray(usersData) ? usersData : []);
          setAdmins(Array.isArray(adminsData) ? adminsData : []);
        }
      } catch (e) {
        setError(e?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    if (role === "ADMIN") {
      loadData();
    }
  }, [role, filter]);

  // Helper function to normalize role
  const normalizeRole = (role) => {
    if (!role) return "";
    return String(role).toUpperCase().trim();
  };

  // Get filtered users based on selected filter
  const filteredUsers = filter === "admins" 
    ? admins 
    : filter === "users" 
    ? users 
    : [...users, ...admins]; // 'all' shows combined list

  // Use stats from API or calculate from loaded data as fallback
  const totalUsers = stats.regularUsers > 0 ? stats.regularUsers : users.length;
  const totalAdmins = stats.totalAdmins > 0 ? stats.totalAdmins : admins.length;
  const totalAll = stats.totalUsers > 0 ? stats.totalUsers : (users.length + admins.length);

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
                    // Map backend fields: userId, name, username, email, mobile, role, lastActiveAt
                    const userId = u?.userId ?? u?.id ?? u?._id ?? idx;
                    const username = u?.username ?? u?.name ?? "-";
                    const email = u?.email ?? "-";
                    const userRole = normalizeRole(u?.role);
                    const isAdmin = userRole === "ADMIN";
                    return (
                      <tr key={userId}>
                        <td>{userId}</td>
                        <td>{username}</td>
                        <td>{email}</td>
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
                            to={`/admin/users/${userId}`}
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


