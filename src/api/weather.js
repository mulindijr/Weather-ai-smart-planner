import api from "../services/api";

// Shared helper to remove null/undefined params
const buildParams = (params = {}) => {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== null && value !== undefined,
    ),
  );
};
