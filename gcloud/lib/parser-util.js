export function parseDate(dateString) {
  if (!dateString) {
    return null;
  }
  if (dateString.includes("/")) {
    const [month, year] = dateString.split("/");
    if (isNaN(month) || isNaN(year)) return null;
    return new Date(year, (month-1));
  }
  return new Date(dateString);
}

export function parseRegexp(text, regexp) {
  const match = regexp.exec(text);
  if (match) {
    return match[0];
  }
  return null;

}

