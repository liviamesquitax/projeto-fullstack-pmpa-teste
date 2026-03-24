export const decodeToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    let normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = normalized.length % 4;

    if (padding) {
      normalized += "=".repeat(4 - padding);
    }

    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
};

export const isTokenValid = (payload) => {
  if (!payload) {
    return false;
  }

  if (!payload.exp) {
    return true;
  }

  return payload.exp * 1000 > Date.now();
};

export const getRoleLabel = (role) => {
  if (role === "super") {
    return "Super";
  }

  if (role === "admin") {
    return "Admin";
  }

  return "Usuario";
};
