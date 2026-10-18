
import type { Locale } from "@/i18n/translations";
import type { CategoryId, Currency } from "@/data/types";

export type LocalizedJSON = Record<Locale, string>;

export type ShopRow = {
  id: string;
  owner_id: string | null;
  name: string;
  description: string | null;
  country: string | null;
  created_at: string;
};

export type ProductRow = {
  id: number;
  shop_id: string | null;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  country: string | null;
  created_at: string;
};

export type ShopWithProducts = ShopRow & {
  products: ProductRow[];
};

export type ShopInput = {
  name: string;
  description?: string;
  country?: string;
};

export type ProductInput = {
  shop_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  country?: string;
};

export type ShopUpdate = Partial<ShopInput>;
export type ProductUpdate = Partial<Omit<ProductInput, "shop_id">>;
