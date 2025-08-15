export function timeAgo(ts) {
  if (!ts) return "";

  const date = new Date(ts);
  if (isNaN(date.getTime())) return ""; // invalid date

  let diff = Date.now() - date.getTime();
  if (diff < 0) diff = 0; // future timestamps treated as "now"

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  return `${days}d`;
}
