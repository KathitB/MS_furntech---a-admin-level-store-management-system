const BASE_URL = "https://6q3cj3gq-5320.inc1.devtunnels.ms";

export const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",

        ...(token && {
          Authorization: `Bearer ${token}`,
        }),

        ...(options.headers || {}),
      },

      ...options,
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(
        data?.status?.message ||
          data?.message ||
          `Request failed: ${response.status} ${response.statusText}`,
      );
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
