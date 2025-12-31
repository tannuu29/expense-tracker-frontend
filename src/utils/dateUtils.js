/**
 * Formats a date string to readable format (e.g. "30 Dec 2025, 12:01 AM")
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
};

/**
 * Calculates time difference and returns human-readable string
 * @param {string|Date} dateString - Date string or Date object
 * @returns {object} Object with { isOnline, statusText, timeAgo }
 */
export const getActivityStatus = (dateString) => {
  if (!dateString) {
    return {
      isOnline: false,
      statusText: "OFFLINE",
      timeAgo: "Never",
    };
  }

  try {
    const lastActive = new Date(dateString);
    if (isNaN(lastActive.getTime())) {
      return {
        isOnline: false,
        statusText: "OFFLINE",
        timeAgo: "Invalid date",
      };
    }

    const now = new Date();
    const diffMs = now - lastActive;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // If within last 5 minutes, user is ONLINE
    if (diffMinutes <= 5) {
      return {
        isOnline: true,
        statusText: "ONLINE",
        timeAgo: "Active now",
      };
    }

    // Calculate time ago string
    let timeAgo = "";
    if (diffMinutes < 60) {
      timeAgo = `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      timeAgo = `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      timeAgo = `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
      // For older dates, show formatted date
      timeAgo = formatDate(dateString);
    }

    return {
      isOnline: false,
      statusText: "OFFLINE",
      timeAgo: `Last seen ${timeAgo}`,
    };
  } catch (error) {
    console.error("Error calculating activity status:", error);
    return {
      isOnline: false,
      statusText: "OFFLINE",
      timeAgo: "Unknown",
    };
  }
};
