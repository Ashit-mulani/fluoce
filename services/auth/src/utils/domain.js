export const ALLOWED_DOMAINS = ["localhost", "imagebox.cloud"];

export const isAllowedDomain = (url) => {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;

    return ALLOWED_DOMAINS.some(
      (allowed) => hostname === allowed || hostname.endsWith("." + allowed)
    );
  } catch (e) {
    return false;
  }
};
