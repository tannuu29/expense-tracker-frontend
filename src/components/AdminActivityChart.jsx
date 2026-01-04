import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchWithAuth, API_BASE_URL } from "../utils/auth";
import "./AdminActivityChart.css";

export default function AdminActivityChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadChartData() {
      setLoading(true);
      setError("");

      try {
        const res = await fetchWithAuth(
          `${API_BASE_URL}/admin/dashboard/users-per-day?days=7`,
          {
            method: "GET",
          }
        );

        if (res.status === 401 || res.status === 403) {
          setError("Unauthorized. Please login again.");
          setLoading(false);
          return;
        }

        if (!res.ok) {
          let message = `Failed to load chart data (${res.status})`;
          try {
            const data = await res.json();
            if (data?.message) message = data.message;
          } catch {
            // ignore JSON parse errors
          }
          throw new Error(message);
        }

        const data = await res.json();
        
        // Handle empty data gracefully
        if (!Array.isArray(data) || data.length === 0) {
          setChartData([]);
        } else {
          // Format data for chart - ensure date is formatted properly
          const formattedData = data.map((item) => ({
            date: formatDateForChart(item.date),
            count: item.count || 0,
          }));
          setChartData(formattedData);
        }
      } catch (e) {
        setError(e?.message || "Failed to load chart data");
        setChartData([]);
      } finally {
        setLoading(false);
      }
    }

    const role = localStorage.getItem("role");
    if (role === "ADMIN") {
      loadChartData();
    } else {
      setLoading(false);
    }
  }, []);

  // Format date for chart display (e.g., "Dec 30" or "30 Dec")
  // Handles both ISO date strings (YYYY-MM-DD) and full datetime strings
  const formatDateForChart = (dateString) => {
    if (!dateString) return "";
    try {
      // Handle ISO date format (YYYY-MM-DD) by adding time to ensure proper parsing
      const dateStr = dateString.includes("T") 
        ? dateString 
        : `${dateString}T00:00:00`;
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="admin-chart-container">
        <div className="admin-chart-loading">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-chart-container">
        <div className="admin-chart-error">{error}</div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="admin-chart-container">
        <h3 className="admin-chart-title">User Registrations (Last 7 Days)</h3>
        <div className="admin-chart-empty">No registration data available</div>
      </div>
    );
  }

  return (
    <div className="admin-chart-container">
      <h3 className="admin-chart-title">User Registrations (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            stroke="#666"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#666"
            style={{ fontSize: "12px" }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            formatter={(value) => [value, "Registrations"]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#28a745"
            strokeWidth={2}
            dot={{ fill: "#28a745", r: 4 }}
            activeDot={{ r: 6 }}
            name="Registrations"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

