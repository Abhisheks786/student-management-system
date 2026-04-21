const API_BASE_URL = "http://127.0.0.1:5000/api";

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
      throw new Error("Cannot connect to backend. Start backend on http://127.0.0.1:5000");
    }
    throw error;
  }
};
