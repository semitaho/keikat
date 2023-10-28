export function useDateFormat(): (date: Date) => string {
  return (date: Date) =>
    date.toLocaleDateString("fi-FI", {
      timeZone: "Europe/Helsinki",
    });
}
