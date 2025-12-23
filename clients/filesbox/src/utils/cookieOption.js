const parseEnvTime = (timeStr) => {
  if (!timeStr) return 7 * 24 * 60 * 60 * 1000;
  const value = parseInt(timeStr);
  if (timeStr.endsWith("d")) return value * 24 * 60 * 60 * 1000;
  if (timeStr.endsWith("h")) return value * 60 * 60 * 1000;
  if (timeStr.endsWith("m")) return value * 60 * 1000;
  return value * 1000;
};

export const cookieOption = ({ domain, expiry }) => {
  let hostname;
  try {
    hostname = new URL(domain).hostname;
  } catch {
    hostname = domain;
  }

  const isLocalhost =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

  return {
    httpOnly: true,
    secure: !isLocalhost,
    sameSite: isLocalhost ? "Lax" : "None",
    domain: isLocalhost ? undefined : hostname,
    path: "/",
    maxAge: parseEnvTime(expiry),
  };
};
