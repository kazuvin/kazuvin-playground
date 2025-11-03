/**
 * Format a date string to a human-readable format
 * @param dateString - ISO date string (e.g., "2025-11-03")
 * @param locale - Locale for formatting (default: "en-US")
 * @returns Formatted date string (e.g., "November 3, 2025")
 */
export function formatDate(
  dateString: string,
  locale: string = "en-US"
): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
