import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Store,
  Settings,
  Inbox,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  TrendingUp,
  MailOpen,
  Image as ImageIcon,
  X,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRouter } from "@/router/Router";
import { categories, countries, getCategory } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { fetchMyShop, fetchShopProducts } from "@/lib/db";
import type { Shop, Product, LocalizedText, Currency, CategoryId } from "@/data/types";
import type { Locale } from "@/i18n/translations";

type Tab = "overview" | "products" | "messages" | "settings";

export function DashboardPage() {
  const { t, locale } = useLanguage();
  const { navigate } = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [myShop, setMyShop] = useState<Shop | null>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showShopCreator, setShowShopCreator] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate({ name: "login" });
      return;
    }
    setLoadingData(true);
    fetchMyShop()
      .then(async (shop) => {
        setMyShop(shop);
        if (shop) {
          const prods = await fetchShopProducts(shop.id);
          setMyProducts(prods);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [user, authLoading, navigate]);

  const reloadProducts = async () => {
    if (!myShop) return;
    const prods = await fetchShopProducts(myShop.id);
    setMyProducts(prods);
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm(t("dash.product.deleteConfirm"))) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return;
    await reloadProducts();
  };

  if (authLoading || loadingData) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-slate-500">
        {t("common.loading")}
      </div>
    );
  }

  if (!myShop) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
          <Store className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-navy-900">{t("dash.title")}</h1>
        <p className="mt-2 text-sm text-slate-500">{t("dash.noShop")}</p>
        <button
          type="button"
          onClick={() => setShowShopCreator(true)}
          className="mt-6 flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          {t("dash.createShop")}
        </button>
        {showShopCreator && (
          <ShopCreator
            onClose={() => setShowShopCreator(false)}
            onCreated={(shop) => {
              setMyShop(shop);
              setShowShopCreator(false);
            }}
          />
        )}
      </div>
    );
  }

  const stats = [
    { label: t("dash.stat.products"), value: myProducts.length, icon: Package, color: "bg-teal-50 text-teal-700" },
    { label: t("dash.stat.views"), value: "—", icon: Eye, color: "bg-navy-50 text-navy-700" },
    { label: t("dash.stat.messages"), value: "—", icon: Inbox, color: "bg-amber-50 text-amber-700" },
    { label: t("dash.stat.profile"), value: "—", icon: TrendingUp, color: "bg-emerald-50 text-emerald-700" },
  ];

  const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: t("dash.overview"), icon: LayoutDashboard },
    { id: "products", label: t("dash.products"), icon: Package },
    { id: "messages", label: t("dash.orders"), icon: Inbox },
    { id: "settings", label: t("dash.settings"), icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{t("dash.title")}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {t("dash.welcome")}, <span className="font-medium text-navy-800">{myShop.name[locale]}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({ name: "shop", slug: myShop.slug })}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Store className="h-4 w-4" />
            {t("dash.previewShop")}
          </button>
          <button
            type="button"
            onClick={() => navigate({ name: "home" })}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("dash.backHome")}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside>
          <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-sm lg:flex-col">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  tab === item.id ? "bg-teal-600 text-white" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div>
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                      <s.icon className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-2xl font-extrabold text-navy-900">{s.value}</p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-navy-900">{t("dash.products")}</h2>
                  <button
                    type="button"
                    onClick={() => setTab("products")}
                    className="text-xs font-medium text-teal-700 hover:text-teal-800"
                  >
                    {t("cat.all")}
                  </button>
                </div>
                <div className="mt-4 space-y-2">
                  {myProducts.slice(0, 3).map((p) => {
                    const cat = getCategory(p.category);
                    return (
                      <div key={p.id} className="flex items-center gap-3 rounded-xl border border-slate-50 p-2">
                        <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-navy-900">{p.title[locale]}</p>
                          <p className="text-xs text-slate-500">{cat ? t(cat.nameKey) : ""}</p>
                        </div>
                        <p className="text-sm font-semibold text-teal-700">
                          {formatPrice(p.price, p.currency, locale)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === "products" && (
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <h2 className="text-sm font-bold text-navy-900">{t("dash.products")}</h2>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setShowEditor(true);
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t("dash.addProduct")}
                </button>
              </div>
              {myProducts.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <ImageIcon className="h-10 w-10 text-slate-300" />
                  <p className="mt-2 text-sm text-slate-500">{t("dash.empty")}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-sm">
                    <thead className="bg-slate-50 text-xs text-slate-500">
                      <tr>
                        <th className="px-4 py-3 text-start font-semibold">{t("dash.col.title")}</th>
                        <th className="px-4 py-3 text-start font-semibold">{t("dash.col.price")}</th>
                        <th className="hidden px-4 py-3 text-start font-semibold sm:table-cell">
                          {t("dash.col.category")}
                        </th>
                        <th className="px-4 py-3 text-start font-semibold">{t("dash.col.status")}</th>
                        <th className="px-4 py-3 text-end font-semibold">{t("dash.col.actions")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {myProducts.map((p) => {
                        const cat = getCategory(p.category);
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <img src={p.image} alt="" className="h-9 w-9 rounded-lg object-cover" />
                                <span className="font-medium text-navy-900">{p.title[locale]}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-medium text-teal-700">
                              {formatPrice(p.price, p.currency, locale)}
                            </td>
                            <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                              {cat ? t(cat.nameKey) : ""}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  p.status === "active"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {p.status === "active" ? t("dash.status.active") : t("dash.status.draft")}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProduct(p);
                                    setShowEditor(true);
                                  }}
                                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-navy-700"
                                  aria-label={t("dash.edit")}
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(p.id)}
                                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                  aria-label={t("dash.delete")}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === "messages" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
              <MailOpen className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">{t("dash.messages.empty")}</p>
            </div>
          )}

          {tab === "settings" && (
            <ShopSettings shop={myShop} onUpdated={(s) => setMyShop(s)} />
          )}
        </div>
      </div>

      {showEditor && (
        <ProductEditor
          shopId={myShop.id}
          product={editingProduct}
          onClose={() => setShowEditor(false)}
          onSaved={async () => {
            setShowEditor(false);
            await reloadProducts();
          }}
        />
      )}
    </div>
  );
}

function ProductEditor({
  shopId,
  product,
  onClose,
  onSaved,
}: {
  shopId: string;
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t, locale } = useLanguage();
  const [titleAr, setTitleAr] = useState(product?.title.ar ?? "");
  const [titleEn, setTitleEn] = useState(product?.title.en ?? "");
  const [titleFr, setTitleFr] = useState(product?.title.fr ?? "");
  const [descAr, setDescAr] = useState(product?.description.ar ?? "");
  const [descEn, setDescEn] = useState(product?.description.en ?? "");
  const [descFr, setDescFr] = useState(product?.description.fr ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [currency, setCurrency] = useState<Currency>(product?.currency ?? "USD");
  const [category, setCategory] = useState<CategoryId>(product?.category ?? "fashion");
  const [country, setCountry] = useState(product?.country ?? "SA");
  const [city, setCity] = useState(product?.city.en ?? "");
  const [image, setImage] = useState(product?.image ?? "");
  const [status, setStatus] = useState<"active" | "draft">(product?.status ?? "active");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!supabase) return;
    setSaving(true);
    setError("");
    const title: LocalizedText = { ar: titleAr, en: titleEn, fr: titleFr } as LocalizedText;
    const description: LocalizedText = { ar: descAr, en: descEn, fr: descFr } as LocalizedText;
    const cityText: LocalizedText = { ar: city, en: city, fr: city } as LocalizedText;
    const payload = {
      shop_id: shopId,
      title,
      description,
      price,
      currency,
      category,
      country,
      city: cityText,
      image,
      status,
    };
    try {
      if (product) {
        const { error: e } = await supabase.from("products").update(payload).eq("id", product.id);
        if (e) throw e;
      } else {
        const { error: e } = await supabase.from("products").insert(payload);
        if (e) throw e;
      }
      onSaved();
    } catch {
      setError(t("dash.error"));
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-900">
            {product ? t("dash.product.edit") : t("dash.product.new")}
          </h2>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-slate-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <Field label={`${t("dash.product.title")} (AR)`}>
            <input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className={inputCls} dir="rtl" />
          </Field>
          <Field label={`${t("dash.product.title")} (EN)`}>
            <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className={inputCls} />
          </Field>
          <Field label={`${t("dash.product.title")} (FR)`}>
            <input value={titleFr} onChange={(e) => setTitleFr(e.target.value)} className={inputCls} />
          </Field>

          <Field label={`${t("dash.product.desc")} (AR)`}>
            <textarea value={descAr} onChange={(e) => setDescAr(e.target.value)} className={inputCls} dir="rtl" rows={2} />
          </Field>
          <Field label={`${t("dash.product.desc")} (EN)`}>
            <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} className={inputCls} rows={2} />
          </Field>
          <Field label={`${t("dash.product.desc")} (FR)`}>
            <textarea value={descFr} onChange={(e) => setDescFr(e.target.value)} className={inputCls} rows={2} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("dash.product.price")}>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label={t("dash.product.currency")}>
              <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className={inputCls}>
                {(["USD", "EUR", "SAR", "AED", "MAD", "EGP", "TND", "GBP"] as Currency[]).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("dash.product.category")}>
              <select value={category} onChange={(e) => setCategory(e.target.value as CategoryId)} className={inputCls}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {t(c.nameKey)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("dash.product.country")}>
              <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls}>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name[locale]}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label={t("dash.product.city")}>
            <input value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
          </Field>

          <Field label={t("dash.product.image")}>
            <input value={image} onChange={(e) => setImage(e.target.value)} className={inputCls} dir="ltr" />
          </Field>

          <Field label={t("dash.product.status")}>
            <select value={status} onChange={(e) => setStatus(e.target.value as "active" | "draft")} className={inputCls}>
              <option value="active">{t("dash.status.active")}</option>
              <option value="draft">{t("dash.status.draft")}</option>
            </select>
          </Field>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {t("dash.product.cancel")}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="flex-1 rounded-xl bg-teal-600 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
            >
              {saving ? t("auth.loading") : t("dash.product.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShopCreator({ onClose, onCreated }: { onClose: () => void; onCreated: (shop: Shop) => void }) {
  const { t, locale } = useLanguage();
  const [shopName, setShopName] = useState("");
  const [country, setCountry] = useState("SA");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState<CategoryId>("fashion");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const create = async () => {
    if (!supabase) return;
    setSaving(true);
    setError("");
    const slug = shopName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);
    const name: LocalizedText = { ar: shopName, en: shopName, fr: shopName } as LocalizedText;
    const cityText: LocalizedText = { ar: city, en: city, fr: city } as LocalizedText;
    try {
      const { data: existing } = await supabase.from("shops").select("id").eq("slug", slug).maybeSingle();
      const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;
      const { data, error: e } = await supabase
        .from("shops")
        .insert({
          slug: finalSlug,
          name,
          tagline: name,
          about: { ar: "", en: "", fr: "" } as Record<Locale, string>,
          country,
          city: cityText,
          category,
          tags: [],
          logo: "",
          cover: "",
          contact_email: email,
          contact_phone: phone,
        })
        .select()
        .single();
      if (e) throw e;
      const row = data as import("@/lib/db-types").ShopRow;
      onCreated({
        id: row.id,
        slug: row.slug,
        name: row.name,
        tagline: row.tagline,
        about: row.about,
        country: row.country,
        city: row.city,
        category: row.category,
        tags: (row.tags ?? []) as LocalizedText[],
        logo: row.logo,
        cover: row.cover,
        joinedYear: new Date(row.created_at).getFullYear(),
        contactEmail: row.contact_email,
        contactPhone: row.contact_phone,
      });
    } catch {
      setError(t("dash.error"));
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-900">{t("dash.shop.create")}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-slate-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          <Field label={t("auth.shopName")}>
            <input value={shopName} onChange={(e) => setShopName(e.target.value)} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("auth.country")}>
              <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls}>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name[locale]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("auth.city")}>
              <input value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
            </Field>
          </div>
          <Field label={t("auth.category")}>
            <select value={category} onChange={(e) => setCategory(e.target.value as CategoryId)} className={inputCls}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {t(c.nameKey)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("auth.email")}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} dir="ltr" />
          </Field>
          <Field label={t("auth.phone")}>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} dir="ltr" />
          </Field>
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <p>{error}</p>
            </div>
          )}
          <button
            type="button"
            onClick={create}
            disabled={saving}
            className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
          >
            {saving ? t("auth.loading") : t("dash.shop.create")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ShopSettings({ shop, onUpdated }: { shop: Shop; onUpdated: (s: Shop) => void }) {
  const { t, locale } = useLanguage();
  const [taglineAr, setTaglineAr] = useState(shop.tagline.ar);
  const [taglineEn, setTaglineEn] = useState(shop.tagline.en);
  const [taglineFr, setTaglineFr] = useState(shop.tagline.fr);
  const [aboutAr, setAboutAr] = useState(shop.about.ar);
  const [aboutEn, setAboutEn] = useState(shop.about.en);
  const [aboutFr, setAboutFr] = useState(shop.about.fr);
  const [logo, setLogo] = useState(shop.logo);
  const [cover, setCover] = useState(shop.cover);
  const [phone, setPhone] = useState(shop.contactPhone);
  const [email, setEmail] = useState(shop.contactEmail);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!supabase) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const { error: e } = await supabase
        .from("shops")
        .update({
          tagline: { ar: taglineAr, en: taglineEn, fr: taglineFr } as Record<Locale, string>,
          about: { ar: aboutAr, en: aboutEn, fr: aboutFr } as Record<Locale, string>,
          logo,
          cover,
          contact_phone: phone,
          contact_email: email,
        })
        .eq("id", shop.id);
      if (e) throw e;
      onUpdated({
        ...shop,
        tagline: { ar: taglineAr, en: taglineEn, fr: taglineFr } as LocalizedText,
        about: { ar: aboutAr, en: aboutEn, fr: aboutFr } as LocalizedText,
        logo,
        cover,
        contactPhone: phone,
        contactEmail: email,
      });
      setSaved(true);
    } catch {
      setError(t("dash.error"));
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100";

  return (
    <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-bold text-navy-900">{t("dash.settings")}</h2>
      <div className="flex items-center gap-4">
        <img src={logo || shop.logo} alt="" className="h-16 w-16 rounded-2xl object-cover bg-slate-100" />
        <div>
          <p className="text-sm font-semibold text-navy-900">{shop.name[locale]}</p>
          <p className="text-xs text-slate-500">{shop.tagline[locale]}</p>
        </div>
      </div>
      <Field label={`${t("dash.shop.tagline")} (AR)`}>
        <input value={taglineAr} onChange={(e) => setTaglineAr(e.target.value)} className={inputCls} dir="rtl" />
      </Field>
      <Field label={`${t("dash.shop.tagline")} (EN)`}>
        <input value={taglineEn} onChange={(e) => setTaglineEn(e.target.value)} className={inputCls} />
      </Field>
      <Field label={`${t("dash.shop.tagline")} (FR)`}>
        <input value={taglineFr} onChange={(e) => setTaglineFr(e.target.value)} className={inputCls} />
      </Field>
      <Field label={`${t("dash.shop.about")} (AR)`}>
        <textarea value={aboutAr} onChange={(e) => setAboutAr(e.target.value)} className={inputCls} dir="rtl" rows={3} />
      </Field>
      <Field label={`${t("dash.shop.about")} (EN)`}>
        <textarea value={aboutEn} onChange={(e) => setAboutEn(e.target.value)} className={inputCls} rows={3} />
      </Field>
      <Field label={`${t("dash.shop.about")} (FR)`}>
        <textarea value={aboutFr} onChange={(e) => setAboutFr(e.target.value)} className={inputCls} rows={3} />
      </Field>
      <Field label={t("dash.shop.logo")}>
        <input value={logo} onChange={(e) => setLogo(e.target.value)} className={inputCls} dir="ltr" />
      </Field>
      <Field label={t("dash.shop.cover")}>
        <input value={cover} onChange={(e) => setCover(e.target.value)} className={inputCls} dir="ltr" />
      </Field>
      <Field label={t("auth.email")}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} dir="ltr" />
      </Field>
      <Field label={t("auth.phone")}>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} dir="ltr" />
      </Field>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-emerald-600">{t("dash.shopSettings.saved")}</p>}
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
      >
        {saving ? t("auth.loading") : t("dash.product.save")}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}
