export const extractKeyFromUrl = (url) => {
  try {
    const u = new URL(url);
    return u.pathname.slice(1); // remove leading "/"
  } catch (err) {
    return null;
  }
};
