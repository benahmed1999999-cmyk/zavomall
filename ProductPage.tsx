import { useEffect, useState } from "react";
import { MapPin, Store, ArrowLeft, Tag, Mail, Phone, MessageSquare } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRouter } from "@/router/Router";
import { getCountry, getCategory } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { ProductCard } from "@/components/Cards";
import { SampleNote } from "@/components/SampleBadge";
import { fetchProduct, fetchShop, fetchRelatedProducts } from "@/lib/db";
import type { Product, Shop } from "@/data/types";

export function ProductPage({ id }: { id: string }) {
  const { t, locale } = useLanguage();
  const { navigate } = useRouter();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [shop, setShop] = useState<Shop | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [relatedShops, setRelatedShops] = useState<Shop[]>([]);

  useEffect(() => {
    setProduct(undefined);
    fetchProduct(id)
      .then(async (p) => {
        setProduct(p);
        if (p) {
          const [s, rel, shops] = await Promise.all([
            fetchShop(p.shopId),
            fetchRelatedProducts(p.category, p.id, 4),
            fetchShop(p.shopId).then(() => [] as Shop[]),
          ]);
          setShop(s);
          setRelated(rel);
          setRelatedShops(shops);
        }
      })
      .catch(() => setProduct(null));
  }, [id]);

  if (product === undefined) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-slate-500">{t("common.loading")}</div>
    );
  }

  if (!product) {
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

  const country = getCountry(product.country);
  const category = getCategory(product.category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate({ name: "browse" })}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-navy-900"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {t("common.back")}
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
          {product.image && <img src={product.image} alt={product.title[locale]} className="h-full w-full object-cover" />}
        </div>

        <div>
          {category && (
            <button
              type="button"
              onClick={() => navigate({ name: "browse", category: category.id })}
              className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 transition hover:bg-teal-100"
            >
              <Tag className="h-3 w-3" />
              {t(category.nameKey)}
            </button>
          )}
          <h1 className="mt-3 text-2xl font-bold text-navy-900 sm:text-3xl">{product.title[locale]}</h1>
          <p className="mt-3 text-3xl font-extrabold text-teal-700">
            {formatPrice(product.price, product.currency, locale)}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <InfoRow label={t("product.country")} value={`${country?.flag ?? ""} ${country?.name[locale] ?? ""}`} />
            <InfoRow label={t("product.city")} value={product.city[locale]} />
            <InfoRow label={t("product.category")} value={category ? t(category.nameKey) : ""} />
            <InfoRow label={t("product.currency")} value={product.currency} />
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-navy-900">{t("product.description")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{product.description[locale]}</p>
          </div>

          {shop && (
            <button
              type="button"
              onClick={() => navigate({ name: "shop", slug: shop.slug })}
              className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-start shadow-sm transition hover:border-teal-200 hover:shadow-md"
            >
              <img
                src={shop.logo || "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"}
                alt={shop.name[locale]}
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="text-xs text-slate-500">{t("product.shop")}</p>
                <p className="text-sm font-semibold text-navy-900">{shop.name[locale]}</p>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3 w-3" />
                  {shop.city[locale]}
                </p>
              </div>
              <Store className="h-5 w-5 text-teal-600" />
            </button>
          )}

          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-900">
              <MessageSquare className="h-4 w-4 text-teal-600" />
              {t("product.contactSeller")}
            </h3>
            {shop && (
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                {shop.contactEmail && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span dir="ltr">{shop.contactEmail}</span>
                  </span>
                )}
                {shop.contactPhone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span dir="ltr">{shop.contactPhone}</span>
                  </span>
                )}
              </div>
            )}
            <div className="mt-3">
              <SampleNote text={t("product.sellerNote")} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-navy-900">{t("shop.products")}</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} shop={undefined} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3 py-2.5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-navy-900">{value}</p>
    </div>
  );
}
