import { getMe, logout } from "@/hooks/api/auth-api.js";
import { setUser } from "@/store/slice/user";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { filesboxUrl } from "@/utils/const.js";

export const useGetMe = () => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await getMe({ domain: filesboxUrl });
      dispatch(setUser(res.data));
      return res.data;
    },
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (data) => {
      return await logout(data);
    },
    onSuccess: () => {
      dispatch(setUser(null));
    },
  });
};
