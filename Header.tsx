import { useEffect, useRef, useState } from "react";
import {
  Globe,
  Menu,
  Search,
  ShoppingBag,
  Store,
  X,
  Check,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { localeFlags, localeNames, type Locale } from "@/i18n/translations";
import { useRouter } from "@/router/Router";
import { useAuth } from "@/lib/auth";
import { LogOut, LayoutDashboard } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const locales: Locale[] = ["ar", "en", "fr"];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-teal-400 hover:text-teal-700"
        aria-label="Language"
      >
        <Globe className="h-4 w-4 text-teal-600" />
        <span>{localeFlags[locale]}</span>
        <span className="hidden sm:inline">{localeNames[locale]}</span>
      </button>
      {open && (
        <div className="absolute end-0 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-200/60 z-50">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-sm transition hover:bg-slate-50 ${
                l === locale ? "text-teal-700 font-semibold" : "text-slate-700"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{localeFlags[l]}</span>
                {localeNames[l]}
              </span>
              {l === locale && <Check className="h-4 w-4 text-teal-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { t } = useLanguage();
  const { navigate, route } = useRouter();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSignOut = async () => {
    await signOut();
    navigate({ name: "home" });
  };

  const navLinks: { label: string; route: Parameters<typeof navigate>[0] }[] = [
    { label: t("nav.home"), route: { name: "home" } },
    { label: t("nav.browse"), route: { name: "browse" } },
    { label: t("nav.about"), route: { name: "about" } },
    { label: t("nav.contact"), route: { name: "contact" } },
  ];

  const isActive = (name: string) => route.name === name;

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ name: "browse", q: search || undefined });
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate({ name: "home" })}
          className="flex shrink-0 items-center gap-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-teal-600 text-white shadow-sm">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-navy-900">
            Zavo<span className="text-teal-600">mall</span>
          </span>
        </button>

        {/* Desktop search */}
        <form onSubmit={submitSearch} className="hidden flex-1 md:block">
          <div className="relative mx-auto max-w-xl">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search.placeholder")}
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 ps-9 pe-4 text-sm text-slate-800 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </form>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => navigate(link.route)}
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                isActive(link.route.name)
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-700 hover:bg-slate-50 hover:text-navy-900"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          {user ? (
            <>
              <button
                type="button"
                onClick={() => navigate({ name: "dashboard" })}
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive("dashboard") ? "bg-teal-50 text-teal-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                {t("nav.dashboard")}
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                {t("auth.logout")}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate({ name: "login" })}
                className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-navy-900"
              >
                {t("nav.login")}
              </button>
              <button
                type="button"
                onClick={() => navigate({ name: "register" })}
                className="flex items-center gap-1.5 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-800"
              >
                <Store className="h-4 w-4" />
                {t("nav.register")}
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="ms-auto flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700"
            aria-label={t("nav.menu")}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <form onSubmit={submitSearch} className="mb-3">
            <div className="relative">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 ps-9 pe-4 text-sm outline-none focus:border-teal-400 focus:bg-white"
              />
            </div>
          </form>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => {
                  navigate(link.route);
                  setMenuOpen(false);
                }}
                className="rounded-lg px-3 py-2.5 text-start text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </button>
            ))}
            <div className="my-2 h-px bg-slate-100" />
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigate({ name: "dashboard" });
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {t("nav.dashboard")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSignOut();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4" />
                  {t("auth.logout")}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigate({ name: "login" });
                    setMenuOpen(false);
                  }}
                  className="rounded-lg px-3 py-2.5 text-start text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {t("nav.login")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate({ name: "register" });
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-navy-900 px-3 py-2.5 text-sm font-semibold text-white"
                >
                  <Store className="h-4 w-4" />
                  {t("nav.register")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
