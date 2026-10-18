import { useLanguage } from "@/i18n/LanguageContext";

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  SAR: "ر.س",
  AED: "د.إ",
  MAD: "د.م.",
  EGP: "ج.م",
  TND: "د.ت",
  GBP: "£",
};

export function formatPrice(price: number, currency: string, locale: string) {
  const symbol = currencySymbols[currency] ?? currency;
  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : locale === "fr" ? "fr-FR" : "en-US", {
    maximumFractionDigits: 0,
  }).format(price);
  return locale === "ar" ? `${formatted} ${symbol}` : `${symbol}${formatted}`;
}

export function useT() {
  const { t } = useLanguage();
  return t;
}
