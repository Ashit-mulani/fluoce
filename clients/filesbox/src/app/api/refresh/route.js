import { backendUrl, filesboxUrl } from "@/utils/const";
import { cookieOption } from "@/utils/cookieOption";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  const cookieHeader = request.headers.get("cookie");

  let refreshToken = undefined;
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|;)\s*refreshToken=([^;]*)/);
    if (match) refreshToken = decodeURIComponent(match[1]);
  }

  if (!refreshToken) {
    return NextResponse.json(
      { message: "No refresh token found" },
      { status: 401 }
    );
  }

  try {
    const res = await axios.post(
      `${backendUrl}/auth/api/v2/refresh`,
      { domain: filesboxUrl },
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
        withCredentials: true,
      }
    );

    const at = res.data?.data?.at;
    const rt = res.data?.data?.rt;
    const dm = res.data?.data?.domain;

    if (!at) {
      return NextResponse.json(
        { message: "Invalid token response" },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      at,
      rt,
    });

    response.cookies.set(
      "accessToken",
      at,
      cookieOption({ domain: dm, expiry: "1h" })
    );

    if (rt) {
      response.cookies.set(
        "refreshToken",
        rt,
        cookieOption({ domain: dm, expiry: "60d" })
      );
    }

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
