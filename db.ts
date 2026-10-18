
import { supabase } from "./supabase";
import type { ShopRow, ProductRow, LocalizedJSON } from "./db-types";
import type { Shop, Product } from "@/data/types";

function localized(value: string | null | undefined): LocalizedJSON {
  const text = value ?? "";
  return { ar: text, en: text, fr: text } as LocalizedJSON;
}

function mapShop(row: ShopRow): Shop {
  return {
    id: row.id,
    slug: row.id,
    name: localized(row.name),
    tagline: localized(row.description),
    about: localized(row.description),
    country: row.country ?? "",
    city: localized(row.country),
    category: "electronics",
    tags: [],
    logo: "",
    cover: "",
    joinedYear: new Date(row.created_at).getFullYear(),
    contactEmail: "",
    contactPhone: "",
  };
}

function mapProduct(row: ProductRow): Product {
  return {
    id: String(row.id),
    shopId: row.shop_id ?? "",
    title: localized(row.name),
    description: localized(row.description),
    price: Number(row.price ?? 0),
    currency: "USD",
    category: "electronics",
    country: row.country ?? "",
    city: localized(row.country),
    image: row.image_url ?? "",
    createdAt: row.created_at,
    status: "active",
  };
}

export async function fetchShops(): Promise<Shop[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ShopRow[]).map(mapShop);
}

export async function fetchShop(slugOrId: string): Promise<Shop | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .eq("id", slugOrId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapShop(data as ShopRow) : null;
}

export async function fetchShopProducts(shopId: string): Promise<Product[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ProductRow[]).map(mapProduct);
}

export async function fetchProduct(id: string): Promise<Product | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", Number(id))
    .maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data as ProductRow) : null;
}

export async function fetchAllProducts(): Promise<Product[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ProductRow[]).map(mapProduct);
}

export async function fetchRelatedProducts(
  category: string,
  excludeId: string,
  limit = 4
): Promise<Product[]> {
  const products = await fetchAllProducts();
  return products
    .filter((product) => product.id !== excludeId)
    .slice(0, limit);
}

export async function fetchRelatedShops(
  category: string,
  excludeId: string,
  limit = 3
): Promise<Shop[]> {
  const shops = await fetchShops();
  return shops.filter((shop) => shop.id !== excludeId).slice(0, limit);
}

export async function fetchMyShop(): Promise<Shop | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .not("owner_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) throw error;
  if (!data || data.length === 0) return null;
  return mapShop(data[0] as ShopRow);
}
