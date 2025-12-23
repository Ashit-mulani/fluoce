import { NextResponse } from "next/server";
import { authUrl } from "./utils/const";

const authServiceUrl = `${authUrl}/auth`;

export async function proxy(request) {
  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(`${authServiceUrl}?ref=${request.url}`);
  }

  if (!accessToken && refreshToken) {
    try {
      const refreshUrl = `${request.nextUrl.origin}/api/refresh`;

      const refreshResponse = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      });

      if (refreshResponse.ok) {
        const nextResponse = NextResponse.next();

        const setCookie = refreshResponse.headers.getSetCookie?.() || [
          refreshResponse.headers.get("set-cookie"),
        ];

        if (setCookie) {
          setCookie.forEach((cookie) => {
            if (cookie) nextResponse.headers.append("Set-Cookie", cookie);
          });
        }

        return nextResponse;
      } else {
        return NextResponse.redirect(`${authServiceUrl}?ref=${request.url}`);
      }
    } catch (err) {
      return NextResponse.redirect(`${authServiceUrl}?ref=${request.url}`);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/preview/tab/:path*",
    // Exclude /preview/shared, only match /preview/ except shared
    "/preview/((?!shared).*)",
  ],
};
