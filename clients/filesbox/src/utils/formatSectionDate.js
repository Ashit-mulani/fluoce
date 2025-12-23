export const formatSectionDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) return "Today";
  if (
    date.toDateString() === new Date(today.getTime() - 86400000).toDateString()
  )
    return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
