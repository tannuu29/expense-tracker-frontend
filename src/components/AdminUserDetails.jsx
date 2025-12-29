import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth, API_BASE_URL } from "../utils/auth";

export default function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check role-based access
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/dashboard");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token")?.trim();
      if (!token) {
        setError("Missing token. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/admin/user/${id}`, {
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
            // ignore
          }
          throw new Error(message);
        }

        const data = await res.json();
        setUser(data || null);
      } catch (e) {
        setError(e?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    }

    const role = localStorage.getItem("role");
    if (role === "ADMIN") {
      load();
    }
  }, [id]);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Link to="/admin/users">← Back to users</Link>
      </div>

      <h2>User Details</h2>

      {loading && <p>Loading…</p>}
      {!loading && error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && user && (
        <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
          {/* Map backend fields: userId, name, username, email, mobile, role, lastActiveAt */}
          <p>
            <strong>ID:</strong> {user?.userId ?? user?.id ?? user?._id ?? "-"}
          </p>
          <p>
            <strong>Name:</strong> {user?.name ?? "-"}
          </p>
          <p>
            <strong>Username:</strong> {user?.username ?? "-"}
          </p>
          <p>
            <strong>Email:</strong> {user?.email ?? "-"}
          </p>
          {user?.mobile && (
            <p>
              <strong>Mobile:</strong> {user.mobile}
            </p>
          )}
          <p>
            <strong>Role:</strong> {user?.role ?? "-"}
          </p>
          {user?.lastActiveAt && (
            <p>
              <strong>Last Active:</strong> {new Date(user.lastActiveAt).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}


