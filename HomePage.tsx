import { useEffect, useState } from "react";
import {
  Search,
  Store,
  MapPin,
  ArrowRight,
  ShoppingBag,
  Globe2,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRouter } from "@/router/Router";
import { categories, countries } from "@/data/catalog";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ProductCard, ShopCard } from "@/components/Cards";
import { fetchShops, fetchAllProducts } from "@/lib/db";
import type { Shop, Product } from "@/data/types";

export function HomePage() {
  const { t, locale } = useLanguage();
  const { navigate } = useRouter();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
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

  const featuredProducts = products.filter((p) => p.status === "active").slice(0, 8);
  const featuredShops = shops.slice(0, 4);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ name: "browse", q: query || undefined, country: country || undefined });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-slate-500">{t("common.loading")}</div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-50/60 to-white">
        <div className="absolute inset-0 -z-10 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #172641 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
          
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 text-base text-slate-600 sm:text-lg lg:mx-8">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* Search bar */}
          <form
            onSubmit={submitSearch}
            className="mx-auto mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/40 sm:p-3"
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("search.placeholder")}
                  className="w-full rounded-xl border-0 bg-slate-50 py-3 ps-11 pe-4 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-100"
                />
              </div>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="rounded-xl border-0 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-teal-100 sm:w-44"
              >
                <option value="">{t("filter.country")}</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name[locale]}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
              >
                {t("search.button")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: `${shops.length}+`, label: t("hero.stat.shops") },
              { value: "30+", label: t("hero.stat.countries") },
              { value: "7", label: t("hero.stat.categories") },
              { value: "0%", label: t("hero.stat.tagline") },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-extrabold text-navy-900">{s.value}</p>
                <p className="mt-1 text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-navy-900">{t("categories.title")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("categories.subtitle")}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ name: "browse" })}
            className="hidden items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800 sm:flex"
          >
            {t("cat.all")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate({ name: "browse", category: cat.id })}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-600 group-hover:text-white">
                <CategoryIcon name={cat.icon} className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold text-navy-900">{t(cat.nameKey)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-navy-900">{t("shop.products")}</h2>
          <button
            type="button"
            onClick={() => navigate({ name: "browse" })}
            className="flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            {t("cat.all")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((p) => {
            const shop = shops.find((s) => s.id === p.shopId);
            return <ProductCard key={p.id} product={p} shop={shop} />;
          })}
        </div>
      </section>

      {/* Featured shops */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-navy-900">{t("nav.browse")}</h2>
          <button
            type="button"
            onClick={() => navigate({ name: "browse" })}
            className="flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            {t("cat.all")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </button>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredShops.map((s) => (
            <ShopCard key={s.id} shop={s} />
          ))}
        </div>
      </section>

      {/* Seller CTA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="absolute inset-0 -z-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #5eead4 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }} />
          <div className="relative">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-300">
              <Store className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">{t("auth.register.title")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">{t("auth.register.subtitle")}</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate({ name: "register" })}
                className="flex items-center gap-2 rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-400"
              >
                {t("hero.cta2")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => navigate({ name: "dashboard" })}
                className="rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
              >
                {t("nav.dashboard")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust features */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: Globe2, title: t("hero.stat.countries"), desc: t("hero.subtitle") },
            { icon: MessageSquare, title: t("product.contactSeller"), desc: t("hero.stat.tagline") },
            { icon: ShieldCheck, title: t("nav.privacy"), desc: t("footer.disclaimer") },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-navy-900">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
