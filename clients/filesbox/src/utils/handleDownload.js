export const handleDownload = async (url, fileName, setLoading) => {
  try {
    if (!url) {
      alert("No download URL provided.");
      return;
    }

    setLoading(true);

    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-store",
      headers: {
        Accept: "application/octet-stream",
      },
    });

    if (!response.ok) alert("Failed to download the file. Please try again.");

    const blob = await response.blob();
    const link = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = link;
    a.download = fileName || "download";
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();

    a.remove();
    URL.revokeObjectURL(link);
  } catch (error) {
    console.log(error);

    alert("Failed to download the file. Please try again.");
  } finally {
    setLoading(false);
  }
};
