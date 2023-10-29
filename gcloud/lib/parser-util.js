export function parseDate(dateString) {
  if (!dateString) {
    return null;
  }
  if (dateString.includes("/")) {
    const [month, year] = dateString.split("/");
    if (isNaN(month) || isNaN(year)) return null;
    return new Date(year, (month-1));
  }
  return null;
}
