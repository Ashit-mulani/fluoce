import { authApi } from "@/lib/axios";

export const getMe = async (data = {}) => {
  try {
    const res = await authApi.post("/auth/api/v2/me", data);
    return res.data;
  } catch (err) {
    return false;
  }
};

export const logout = async (data = {}) => {
  try {
    const res = await authApi.post("/auth/api/v2/logout", data);
    return res.data;
  } catch (err) {
    return false;
  }
};
