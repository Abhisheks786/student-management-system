const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://student-management-system-2ius.onrender.com/api";

export const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...(options.headers || {})
      },
      ...options
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError") {
      throw new Error("Cannot connect to backend. Check VITE_API_BASE_URL and backend CORS.");
    }
    throw error;
  }
};
