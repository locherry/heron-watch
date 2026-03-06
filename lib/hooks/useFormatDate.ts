import { useTranslation } from "react-i18next";

export function formatDate(
  locale: string,
  date: Date | string | null | undefined,
  fallback = "-",
): string {
  if (!date) return fallback;

  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return fallback;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

// Hook version for convenience
export function useFormatDate(fallback = "-") {
  const { i18n } = useTranslation();
  return (date: Date | string | null | undefined) =>
    formatDate(i18n.language || "en", date, fallback);
}
