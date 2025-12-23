export const r2Handler = async (fn) => {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (err) {
    let message =
      "There was a problem storing or accessing your file in the cloud. Please try again later.";
    if (err && err.message) {
      message = `Cloud storage error: ${err.message}`;
    }
    return { success: false, data: null, error: message };
  }
};
