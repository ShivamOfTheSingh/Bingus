export function timestampToTimeAgo(timestamp: string): string {
  const now = new Date(); // Current time
  const pastDate = new Date(timestamp); // Input timestamp as a Date object

  const differenceInMs = now.getTime() - pastDate.getTime(); // Difference in milliseconds
  const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));
  const differenceInHours = Math.floor(differenceInMs / (1000 * 60 * 60));
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
  const differenceInMonths = Math.floor(differenceInMs / (1000 * 60 * 60 * 24 * 30));
  const differenceInYears = Math.floor(differenceInMs / (1000 * 60 * 60 * 24 * 365));

  if (differenceInMinutes < 1) {
    return "Just now";
  } else if (differenceInMinutes < 60) {
    return `${differenceInMinutes} minute${differenceInMinutes === 1 ? "" : "s"} ago`;
  } else if (differenceInHours < 24) {
    return `${differenceInHours} hour${differenceInHours === 1 ? "" : "s"} ago`;
  } else if (differenceInDays < 30) {
    return `${differenceInDays} day${differenceInDays === 1 ? "" : "s"} ago`;
  } else if (differenceInMonths < 12) {
    return `${differenceInMonths} month${differenceInMonths === 1 ? "" : "s"} ago`;
  } else {
    return `${differenceInYears} year${differenceInYears === 1 ? "" : "s"} ago`;
  }
}