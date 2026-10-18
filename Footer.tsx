import { ShoppingBag, Store, Shield, FileText, Info, Mail } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRouter } from "@/router/Router";

export function Footer() {
  const { t } = useLanguage();
  const { navigate } = useRouter();

  const explore = [
    { label: t("nav.home"), route: { name: "home" as const } },
    { label: t("nav.browse"), route: { name: "browse" as const } },
    { label: t("nav.about"), route: { name: "about" as const } },
    { label: t("nav.contact"), route: { name: "contact" as const } },
  ];

  const sellers = [
    { label: t("nav.sell"), route: { name: "register" as const } },
    { label: t("nav.login"), route: { name: "login" as const } },
    { label: t("nav.dashboard"), route: { name: "dashboard" as const } },
  ];

  const legal = [
    { label: t("nav.privacy"), route: { name: "privacy" as const } },
    { label: t("nav.terms"), route: { name: "terms" as const } },
  ];

  return (
    <footer className="mt-20 border-t border-slate-100 bg-navy-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold text-white">
                Zavo<span className="text-teal-400">mall</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-slate-400">{t("footer.tagline")}</p>
            <p className="mt-3 text-xs text-slate-500">{t("footer.notReal")}</p>
          </div>

          <FooterCol
            title={t("footer.explore")}
            icon={<Info className="h-4 w-4 text-teal-400" />}
            items={explore}
            navigate={navigate}
          />
          <FooterCol
            title={t("footer.sellers")}
            icon={<Store className="h-4 w-4 text-teal-400" />}
            items={sellers}
            navigate={navigate}
          />
          <FooterCol
            title={t("footer.legal")}
            icon={<Shield className="h-4 w-4 text-teal-400" />}
            items={legal}
            navigate={navigate}
          />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Zavomall. {t("footer.rights")}</p>
          <p className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            {t("footer.disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  icon,
  items,
  navigate,
}: {
  title: string;
  icon: React.ReactNode;
  items: { label: string; route: { name: "home" | "browse" | "about" | "contact" | "register" | "login" | "dashboard" | "privacy" | "terms" } }[];
  navigate: (r: { name: "home" | "browse" | "about" | "contact" | "register" | "login" | "dashboard" | "privacy" | "terms" }) => void;
}) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
        {icon}
        {title}
      </h4>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              onClick={() => navigate(item.route)}
              className="text-sm text-slate-400 transition hover:text-teal-400"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
