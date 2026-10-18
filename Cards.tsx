import { MapPin, Store } from "lucide-react";
import type { Product, Shop } from "@/data/types";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRouter } from "@/router/Router";
import { getCountry, getCategory } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product, shop }: { product: Product; shop?: Shop }) {
  const { t, locale } = useLanguage();
  const { navigate } = useRouter();
  const country = getCountry(product.country);
  const category = getCategory(product.category);

  return (
    <button
      type="button"
      onClick={() => navigate({ name: "product", id: product.id })}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white text-start shadow-sm transition-all hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg hover:shadow-slate-200/50"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.image}
          alt={product.title[locale]}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {category && (
          <span className="absolute start-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-navy-800 backdrop-blur">
            {t(category.nameKey)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-navy-900">{product.title[locale]}</h3>
        {shop && (
          <p className="mt-1 truncate text-xs text-slate-500">
            <Store className="me-1 inline h-3 w-3" />
            {shop.name[locale]}
          </p>
        )}
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3 w-3" />
          {country?.flag} {product.city[locale]}
        </p>
        <p className="mt-2 text-base font-bold text-teal-700">
          {formatPrice(product.price, product.currency, locale)}
        </p>
      </div>
    </button>
  );
}

export function ShopCard({ shop }: { shop: Shop }) {
  const { t, locale } = useLanguage();
  const { navigate } = useRouter();
  const country = getCountry(shop.country);
  const category = getCategory(shop.category);

  return (
    <button
      type="button"
      onClick={() => navigate({ name: "shop", slug: shop.slug })}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white text-start shadow-sm transition-all hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg hover:shadow-slate-200/50"
    >
      <div className="relative h-28 overflow-hidden bg-slate-100">
        <img
          src={shop.cover}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="-mt-10 mb-2 flex items-end justify-between">
          <img
            src={shop.logo}
            alt={shop.name[locale]}
            loading="lazy"
            className="h-14 w-14 rounded-xl border-2 border-white object-cover shadow-sm"
          />
          {category && (
            <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
              {t(category.nameKey)}
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold text-navy-900">{shop.name[locale]}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-slate-500">{shop.tagline[locale]}</p>
        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3 w-3" />
          {country?.flag} {shop.city[locale]}
        </p>
      </div>
    </button>
  );
}
