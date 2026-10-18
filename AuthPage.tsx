import { useState } from "react";
import { Store, Mail, Lock, ArrowRight, ArrowLeft, AlertCircle, Phone as PhoneIcon } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRouter } from "@/router/Router";
import { categories, countries } from "@/data/catalog";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { LocalizedText } from "@/data/types";
import type { Locale } from "@/i18n/translations";

type Mode = "login" | "register";

export function AuthPage({ mode }: { mode: Mode }) {
  const { t, locale } = useLanguage();
  const { navigate } = useRouter();
  const { signIn, signUp } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    setSubmitted(true);
    try {
      if (isRegister) {
        await signUp(email, password);
        if (supabase) {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            const slug = shopName
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
              .replace(/^-+|-+$/g, "")
              .slice(0, 40);
            const name: LocalizedText = { ar: shopName, en: shopName, fr: shopName } as LocalizedText;
            const cityText: LocalizedText = { ar: city, en: city, fr: city } as LocalizedText;
            const { data: existing } = await supabase.from("shops").select("id").eq("slug", slug).maybeSingle();
            const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;
            await supabase.from("shops").insert({
              slug: finalSlug,
              name,
              tagline: name,
              about: { ar: "", en: "", fr: "" } as Record<Locale, string>,
              country,
              city: cityText,
              category: category || "fashion",
              tags: [],
              logo: "",
              cover: "",
              contact_email: email,
              contact_phone: phone,
            });
          }
        }
        setSuccess(t("auth.success.register"));
      } else {
        await signIn(email, password);
        navigate({ name: "dashboard" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("Invalid login")) setError(t("auth.error.invalid"));
      else if (msg.includes("already registered") || msg.includes("already been registered"))
        setError(t("auth.error.exists"));
      else setError(t("auth.error.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-700 to-teal-600 text-white shadow-sm">
          <Store className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-navy-900">
          {isRegister ? t("auth.register.title") : t("auth.login.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isRegister ? t("auth.register.subtitle") : t("auth.login.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        {isRegister && (
          <Field label={t("auth.shopName")} icon={<Store className="h-4 w-4 text-slate-400" />}>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className={inputClass}
              placeholder={t("auth.shopName")}
            />
          </Field>
        )}

        <Field label={t("auth.email")} icon={<Mail className="h-4 w-4 text-slate-400" />}>
          <input
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="shop@example.com"
          />
        </Field>

        <Field label={t("auth.password")} icon={<Lock className="h-4 w-4 text-slate-400" />}>
          <input
            type="password"
            required
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </Field>

        {isRegister && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("auth.country")}>
                <select
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    {t("auth.country")}
                  </option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name[locale]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("auth.city")}>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                  placeholder={t("auth.city")}
                />
              </Field>
            </div>

            <Field label={t("auth.phone")} icon={<PhoneIcon className="h-4 w-4 text-slate-400" />}>
              <input
                type="tel"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+966 5x xxx xxxx"
              />
            </Field>

            <Field label={t("auth.category")}>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <label
                    key={c.id}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50 has-[:checked]:text-teal-700"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={c.id}
                      checked={category === c.id}
                      onChange={() => setCategory(c.id)}
                      className="hidden"
                    />
                    <CategoryIcon name={c.icon} className="h-3.5 w-3.5" />
                    {t(c.nameKey)}
                  </label>
                ))}
              </div>
            </Field>
          </>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <p>{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-60"
        >
          {loading ? t("auth.loading") : isRegister ? t("auth.register.btn") : t("auth.login.btn")}
          {!loading && <ArrowRight className="h-4 w-4 rtl:rotate-180" />}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        {isRegister ? t("auth.haveAccount") : t("auth.noAccount")}{" "}
        <button
          type="button"
          onClick={() => navigate({ name: isRegister ? "login" : "register" })}
          className="font-semibold text-teal-700 hover:text-teal-800"
        >
          {isRegister ? t("auth.login.btn") : t("auth.register.btn")}
        </button>
      </div>

      <button
        type="button"
        onClick={() => navigate({ name: "home" })}
        className="mx-auto mt-6 flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-navy-900"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {t("common.back")}
      </button>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</span>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">{icon}</span>}
        <div className={icon ? "[&_input]:ps-9 [&_select]:ps-9" : ""}>{children}</div>
      </div>
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100";
