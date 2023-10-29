const TARGET_TIMEZONE = "Europe/Helsinki";
export function useDateFormat(): ((date: Date) => string)[] {
  return [
    (date: Date) =>
      date.toLocaleDateString("fi-FI", {
        timeZone: "Europe/Helsinki",
      }),
    (date: Date) => {
      const month = date.toLocaleDateString("fi-FI", {
        month: "2-digit",
        timeZone: TARGET_TIMEZONE,
      });
      const year = date.toLocaleDateString("fi-FI", {
        year: "numeric",
        timeZone: TARGET_TIMEZONE,
      });
      return `${month}/${year}`;
    },
  ];
}
