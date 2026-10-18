import type { Category, Country } from "./types";

export const categories: Category[] = [
  {
    id: "fashion",
    nameKey: "cat.fashion",
    descKey: "cat.fashion.desc",
    image:
      "https://images.pexels.com/photos/8311880/pexels-photo-8311880.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    icon: "Shirt",
  },
  {
    id: "electronics",
    nameKey: "cat.electronics",
    descKey: "cat.electronics.desc",
    image:
      "https://images.pexels.com/photos/38555192/pexels-photo-38555192.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    icon: "Laptop",
  },
  {
    id: "phones",
    nameKey: "cat.phones",
    descKey: "cat.phones.desc",
    image:
      "https://images.pexels.com/photos/13844013/pexels-photo-13844013.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    icon: "Smartphone",
  },
  {
    id: "home",
    nameKey: "cat.home",
    descKey: "cat.home.desc",
    image:
      "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    icon: "Sofa",
  },
  {
    id: "beauty",
    nameKey: "cat.beauty",
    descKey: "cat.beauty.desc",
    image:
      "https://images.pexels.com/photos/12969358/pexels-photo-12969358.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    icon: "Sparkles",
  },
  {
    id: "sports",
    nameKey: "cat.sports",
    descKey: "cat.sports.desc",
    image:
      "https://images.pexels.com/photos/6740821/pexels-photo-6740821.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    icon: "Dumbbell",
  },
  {
    id: "groceries",
    nameKey: "cat.groceries",
    descKey: "cat.groceries.desc",
    image:
      "https://images.pexels.com/photos/2449665/pexels-photo-2449665.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    icon: "ShoppingBasket",
  },
];

export const countries: Country[] = [
  {
    code: "SA",
    flag: "🇸🇦",
    name: { ar: "السعودية", en: "Saudi Arabia", fr: "Arabie saoudite" },
    cities: [
      { ar: "الرياض", en: "Riyadh", fr: "Riyad" },
      { ar: "جدة", en: "Jeddah", fr: "Djeddah" },
      { ar: "الدمام", en: "Dammam", fr: "Dammam" },
    ],
  },
  {
    code: "AE",
    flag: "🇦🇪",
    name: { ar: "الإمارات", en: "United Arab Emirates", fr: "Émirats arabes unis" },
    cities: [
      { ar: "دبي", en: "Dubai", fr: "Dubaï" },
      { ar: "أبو ظبي", en: "Abu Dhabi", fr: "Abu Dhabi" },
      { ar: "الشارقة", en: "Sharjah", fr: "Charjah" },
    ],
  },
  {
    code: "EG",
    flag: "🇪🇬",
    name: { ar: "مصر", en: "Egypt", fr: "Égypte" },
    cities: [
      { ar: "القاهرة", en: "Cairo", fr: "Le Caire" },
      { ar: "الإسكندرية", en: "Alexandria", fr: "Alexandrie" },
    ],
  },
  {
    code: "MA",
    flag: "🇲🇦",
    name: { ar: "المغرب", en: "Morocco", fr: "Maroc" },
    cities: [
      { ar: "الدار البيضاء", en: "Casablanca", fr: "Casablanca" },
      { ar: "مراكش", en: "Marrakech", fr: "Marrakech" },
      { ar: "الرباط", en: "Rabat", fr: "Rabat" },
    ],
  },
  {
    code: "TN",
    flag: "🇹🇳",
    name: { ar: "تونس", en: "Tunisia", fr: "Tunisie" },
    cities: [
      { ar: "تونس", en: "Tunis", fr: "Tunis" },
      { ar: "صفاقس", en: "Sfax", fr: "Sfax" },
    ],
  },
  {
    code: "FR",
    flag: "🇫🇷",
    name: { ar: "فرنسا", en: "France", fr: "France" },
    cities: [
      { ar: "باريس", en: "Paris", fr: "Paris" },
      { ar: "مرسيليا", en: "Marseille", fr: "Marseille" },
      { ar: "ليون", en: "Lyon", fr: "Lyon" },
    ],
  },
  {
    code: "TR",
    flag: "🇹🇷",
    name: { ar: "تركيا", en: "Turkey", fr: "Turquie" },
    cities: [
      { ar: "إسطنبول", en: "Istanbul", fr: "Istanbul" },
      { ar: "أنقرة", en: "Ankara", fr: "Ankara" },
    ],
  },
  {
    code: "GB",
    flag: "🇬🇧",
    name: { ar: "بريطانيا", en: "United Kingdom", fr: "Royaume-Uni" },
    cities: [
      { ar: "لندن", en: "London", fr: "Londres" },
      { ar: "مانشستر", en: "Manchester", fr: "Manchester" },
    ],
  },
];

export function getCountry(code: string) {
  return countries.find((c) => c.code === code);
}

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}
