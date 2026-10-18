import type { Locale } from "@/i18n/translations";

export type CategoryId =
  | "fashion"
  | "electronics"
  | "phones"
  | "home"
  | "beauty"
  | "sports"
  | "groceries";

export type LocalizedText = Record<Locale, string>;

export type Category = {
  id: CategoryId;
  nameKey: string;
  descKey: string;
  image: string;
  icon: string;
};

export type Country = {
  code: string;
  name: LocalizedText;
  flag: string;
  cities: LocalizedText[];
};

export type Currency = "USD" | "EUR" | "SAR" | "AED" | "MAD" | "EGP" | "TND" | "GBP";

export type Shop = {
  id: string;
  slug: string;
  name: LocalizedText;
  tagline: LocalizedText;
  about: LocalizedText;
  country: string;
  city: LocalizedText;
  category: CategoryId;
  tags: LocalizedText[];
  logo: string;
  cover: string;
  joinedYear: number;
  contactEmail: string;
  contactPhone: string;
};

export type Product = {
  id: string;
  shopId: string;
  title: LocalizedText;
  description: LocalizedText;
  price: number;
  currency: Currency;
  category: CategoryId;
  country: string;
  city: LocalizedText;
  image: string;
  createdAt: string;
  status: "active" | "draft";
};
