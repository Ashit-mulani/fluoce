export const isAllowedDomain = (url) => {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;

    if (hostname === "localhost") return true;

    if (hostname === "fluoce.com" || hostname.endsWith(".fluoce.com")) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
};
