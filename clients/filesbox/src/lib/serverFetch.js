"use server";

import { cookies } from "next/headers";
import { backendUrl, filesboxUrl } from "../utils/const";

export async function serverFetch(url, options = {}) {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && refreshToken) {
    const refreshRes = await fetch(`${filesboxUrl}/api/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!refreshRes.ok) {
      return { success: false, message: "Unauthorized" };
    }

    const { at: newAccessToken } = await refreshRes.json();
    accessToken = newAccessToken;
  }

  let res = await fetch(backendUrl + url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (res.status === 401 && refreshToken) {
    const refreshRes = await fetch(`${filesboxUrl}/api/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!refreshRes.ok) {
      return { success: false, message: "Unauthorized" };
    }

    const { at: newAccessToken } = await refreshRes.json();

    res = await fetch(backendUrl + url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newAccessToken}`,
      },
      credentials: "include",
    });
  }

  if (!res.ok) {
    return { success: false, message: "Something went wrong" };
  }

  return await res.json();
}
