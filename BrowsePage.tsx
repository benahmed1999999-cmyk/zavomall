import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X, MapPin, Store, Search } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRouter, type Route } from "@/router/Router";
import { categories, countries } from "@/data/catalog";
import { ProductCard, ShopCard } from "@/components/Cards";
import { CategoryIcon } from "@/components/CategoryIcon";
import { fetchShops, fetchAllProducts } from "@/lib/db";
import type { Shop, Product } from "@/data/types";

type SortKey = "recent" | "priceLow" | "priceHigh";

export function BrowsePage({ route }: { route: Extract<Route, { name: "browse" }> }) {
  const { t, locale } = useLanguage();
  const { navigate } = useRouter();

  const [category, setCategory] = useState(route.category ?? "");
  const [country, setCountry] = useState(route.country ?? "");
  const [city, setCity] = useState(route.city ?? "");
  const [q, setQ] = useState(route.q ?? "");
  const [sort, setSort] = useState<SortKey>("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [tab, setTab] = useState<"products" | "shops">("products");
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchShops(), fetchAllProducts()])
      .then(([s, p]) => {
        setShops(s);
        setProducts(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const selectedCountry = countries.find((c) => c.code === country);
  const cities = selectedCountry?.cities ?? [];

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => p.status === "active");
    if (category) list = list.filter((p) => p.category === category);
    if (country) list = list.filter((p) => p.country === country);
    if (city) {
      const c = selectedCountry?.cities.find((ci) => ci.en === city || ci.ar === city || ci.fr === city);
      if (c) list = list.filter((p) => p.city.en === c.en);
    }
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title[locale]?.toLowerCase().includes(needle) ||
          p.description[locale]?.toLowerCase().includes(needle) ||
          p.city[locale]?.toLowerCase().includes(needle),
      );
    }
    if (sort === "priceLow") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "priceHigh") list = [...list].sort((a, b) => b.price - a.price);
    else list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return list;
  }, [products, category, country, city, q, sort, locale, selectedCountry]);

  const filteredShops = useMemo(() => {
    let list = shops;
    if (category) list = list.filter((s) => s.category === category);
    if (country) list = list.filter((s) => s.country === country);
    if (city) {
      const c = selectedCountry?.cities.find((ci) => ci.en === city || ci.ar === city || ci.fr === city);
      if (c) list = list.filter((s) => s.city.en === c.en);
    }
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.name[locale]?.toLowerCase().includes(needle) ||
          s.tagline[locale]?.toLowerCase().includes(needle) ||
          s.city[locale]?.toLowerCase().includes(needle),
      );
    }
    return list;
  }, [shops, category, country, city, q, locale, selectedCountry]);

  const clearFilters = () => {
    setCategory("");
    setCountry("");
    setCity("");
    setQ("");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-slate-500">{t("common.loading")}</div>
    );
  }

  const FilterPanel = (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          {t("filter.category")}
        </label>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={!category} onClick={() => setCategory("")}>
            {t("filter.all")}
          </FilterChip>
          {categories.map((c) => (
            <FilterChip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
              <CategoryIcon name={c.icon} className="h-3.5 w-3.5" />
              {t(c.nameKey)}
            </FilterChip>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          {t("filter.country")}
        </label>
        <select
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setCity("");
          }}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
        >
          <option value="">{t("filter.all")}</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name[locale]}
            </option>
          ))}
        </select>
      </div>

      {cities.length > 0 && (
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t("filter.city")}
          </label>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={!city} onClick={() => setCity("")}>
              {t("filter.all")}
            </FilterChip>
            {cities.map((c) => (
              <FilterChip key={c.en} active={city === c.en} onClick={() => setCity(c.en)}>
                <MapPin className="h-3.5 w-3.5" />
                {c[locale]}
              </FilterChip>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={clearFilters}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
      >
        <X className="h-4 w-4" />
        {t("filter.clear")}
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">
          {q ? `${t("search.query")} "${q}"` : t("nav.browse")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {tab === "products"
            ? `${filteredProducts.length} ${t("filter.results")}`
            : `${filteredShops.length} ${t("nav.browse")}`}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.placeholder")}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 ps-9 pe-4 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-teal-400"
          >
            <option value="recent">{t("filter.sort.recent")}</option>
            <option value="priceLow">{t("filter.sort.priceLow")}</option>
            <option value="priceHigh">{t("filter.sort.priceHigh")}</option>
          </select>
          <button
            type="button"
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t("filter.title")}
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-2 border-b border-slate-100">
        <TabButton active={tab === "products"} onClick={() => setTab("products")}>
          <Search className="h-4 w-4" />
          {t("shop.products")}
        </TabButton>
        <TabButton active={tab === "shops"} onClick={() => setTab("shops")}>
          <Store className="h-4 w-4" />
          {t("nav.browse")}
        </TabButton>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-navy-900">
              <SlidersHorizontal className="h-4 w-4 text-teal-600" />
              {t("filter.title")}
            </h3>
            {FilterPanel}
          </div>
        </aside>

        <div className="flex-1">
          {tab === "products" ? (
            filteredProducts.length === 0 ? (
              <EmptyState message={t("search.noresults")} />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((p) => {
                  const shop = shops.find((s) => s.id === p.shopId);
                  return <ProductCard key={p.id} product={p} shop={shop} />;
                })}
              </div>
            )
          ) : filteredShops.length === 0 ? (
            <EmptyState message={t("search.noresults")} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredShops.map((s) => (
                <ShopCard key={s.id} shop={s} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute end-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-navy-900">{t("filter.title")}</h3>
              <button type="button" onClick={() => setShowFilters(false)} className="rounded-full p-1 text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            {FilterPanel}
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="mt-4 w-full rounded-xl bg-teal-600 py-2.5 text-sm font-semibold text-white"
            >
              {t("filter.apply")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
        active ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-navy-900"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-20 text-center">
      <Search className="h-10 w-10 text-slate-300" />
      <p className="mt-3 text-sm text-slate-500">{message}</p>
    </div>
  );
}
