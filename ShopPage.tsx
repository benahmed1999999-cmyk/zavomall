import { useEffect, useState } from "react";
import { MapPin, Store, Mail, Phone, Calendar, ArrowLeft, Tag } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRouter } from "@/router/Router";
import { getCountry, getCategory } from "@/data/catalog";
import { ProductCard, ShopCard } from "@/components/Cards";
import { SampleNote } from "@/components/SampleBadge";
import { fetchShop, fetchShopProducts, fetchRelatedShops } from "@/lib/db";
import type { Shop, Product } from "@/data/types";

export function ShopPage({ slug }: { slug: string }) {
  const { t, locale } = useLanguage();
  const { navigate } = useRouter();
  const [shop, setShop] = useState<Shop | null | undefined>(undefined);
  const [shopProducts, setShopProducts] = useState<Product[]>([]);
  const [relatedShops, setRelatedShops] = useState<Shop[]>([]);

  useEffect(() => {
    setShop(undefined);
    fetchShop(slug)
      .then(async (s) => {
        setShop(s);
        if (s) {
          const [prods, related] = await Promise.all([
            fetchShopProducts(s.id),
            fetchRelatedShops(s.category, s.id, 3),
          ]);
          setShopProducts(prods);
          setRelatedShops(related);
        }
      })
      .catch(() => setShop(null));
  }, [slug]);

  if (shop === undefined) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-slate-500">{t("common.loading")}</div>
    );
  }

  if (!shop) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-navy-900">{t("common.notFound.title")}</h1>
        <button
          type="button"
          onClick={() => navigate({ name: "browse" })}
          className="mt-4 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          {t("common.notFound.cta")}
        </button>
      </div>
    );
  }

  const country = getCountry(shop.country);
  const category = getCategory(shop.category);

  return (
    <div>
      <div className="relative h-48 overflow-hidden bg-navy-900 sm:h-64">
        {shop.cover && <img src={shop.cover} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-navy-900/20" />
        <button
          type="button"
          onClick={() => navigate({ name: "browse" })}
          className="absolute start-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-navy-900 backdrop-blur transition hover:bg-white"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
          {t("common.back")}
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-12 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end">
          <img
            src={shop.logo || "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"}
            alt={shop.name[locale]}
            className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-md sm:h-28 sm:w-28"
          />
          <div className="flex-1 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-navy-900">{shop.name[locale]}</h1>
              {category && (
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                  {t(category.nameKey)}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-600">{shop.tagline[locale]}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {country?.flag} {shop.city[locale]}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {t("shop.joined")} {shop.joinedYear}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <SampleNote text={t("shop.sampleNote")} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <section>
              <h2 className="text-lg font-bold text-navy-900">{t("shop.about")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{shop.about[locale]}</p>
            </section>

            {shop.tags.length > 0 && (
              <section className="mt-6">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                  <Tag className="h-4 w-4 text-teal-600" />
                  {t("shop.tags")}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {shop.tags.map((tag, i) => (
                    <span key={i} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                      {tag[locale]}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-8">
              <h2 className="text-lg font-bold text-navy-900">{t("shop.allProducts")}</h2>
              {shopProducts.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">{t("dash.empty")}</p>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {shopProducts.map((p) => (
                    <ProductCard key={p.id} product={p} shop={shop} />
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside>
            <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-bold text-navy-900">
                <Store className="h-4 w-4 text-teal-600" />
                {t("shop.contact")}
              </h3>
              <div className="mt-4 space-y-3 text-sm">
                {shop.contactEmail && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span dir="ltr">{shop.contactEmail}</span>
                  </div>
                )}
                {shop.contactPhone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span dir="ltr">{shop.contactPhone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {country?.flag} {shop.city[locale]}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {relatedShops.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-navy-900">{t("product.relatedShops")}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedShops.map((s) => (
                <ShopCard key={s.id} shop={s} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
