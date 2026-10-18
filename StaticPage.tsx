import { useState } from "react";
import {
  Info,
  Mail,
  Send,
  Shield,
  FileText,
  Target,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRouter } from "@/router/Router";
import { SampleBadge } from "@/components/SampleBadge";

export function StaticPage({ page }: { page: "about" | "contact" | "privacy" | "terms" }) {
  const { t } = useLanguage();
  const { navigate } = useRouter();

  if (page === "about") return <AboutPage />;
  if (page === "contact") return <ContactPage />;
  if (page === "privacy") return <PrivacyPage />;
  return <TermsPage />;
}

function PageShell({
  icon,
  title,
  intro,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-700 to-teal-600 text-white shadow-sm">
          {icon}
        </span>
        <h1 className="mt-4 text-3xl font-bold text-navy-900">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">{intro}</p>
      </div>
      <div className="mt-10">{children}</div>
    </div>
  );
}

function AboutPage() {
  const { t } = useLanguage();
  return (
    <PageShell icon={<Info className="h-6 w-6" />} title={t("about.title")} intro={t("about.intro")}>
      <div className="space-y-8">
        <Section icon={<Target className="h-5 w-5" />} title={t("about.missionTitle")}>
          <p className="text-sm leading-relaxed text-slate-600">{t("about.mission")}</p>
        </Section>

        <Section icon={<Heart className="h-5 w-5" />} title={t("about.valuesTitle")}>
          <ul className="space-y-2">
            {[t("about.value1"), t("about.value2"), t("about.value3")].map((v) => (
              <li key={v} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                {v}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={<Mail className="h-5 w-5" />} title={t("about.contactTitle")}>
          <p className="text-sm text-slate-600">{t("about.contactText")}</p>
        </Section>
      </div>
    </PageShell>
  );
}

function ContactPage() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <PageShell icon={<Mail className="h-6 w-6" />} title={t("contact.title")} intro={t("contact.intro")}>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label={t("contact.name")} type="text" required />
          <Input label={t("contact.email")} type="email" required />
        </div>
        <Input label={t("contact.subject")} type="text" required />
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("contact.message")}</span>
          <textarea
            required
            rows={5}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
        </label>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          <Send className="h-4 w-4" />
          {t("contact.send")}
        </button>
        <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">{t("contact.note")}</div>
        {sent && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            {t("contact.sent")}
          </div>
        )}
      </form>
    </PageShell>
  );
}

function PrivacyPage() {
  const { t } = useLanguage();
  return (
    <PageShell icon={<Shield className="h-6 w-6" />} title={t("privacy.title")} intro={t("privacy.intro")}>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <SampleBadge text={t("common.sample")} className="mb-4" />
        <div className="space-y-4">
          {[t("privacy.p1"), t("privacy.p2"), t("privacy.p3"), t("privacy.p4"), t("privacy.p5")].map((p, i) => (
            <p key={i} className="flex items-start gap-2 text-sm leading-relaxed text-slate-600">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              {p}
            </p>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function TermsPage() {
  const { t } = useLanguage();
  return (
    <PageShell icon={<FileText className="h-6 w-6" />} title={t("terms.title")} intro={t("terms.intro")}>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <SampleBadge text={t("common.sample")} className="mb-4" />
        <div className="space-y-4">
          {[t("terms.p1"), t("terms.p2"), t("terms.p3"), t("terms.p4"), t("terms.p5")].map((p, i) => (
            <p key={i} className="flex items-start gap-2 text-sm leading-relaxed text-slate-600">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              {p}
            </p>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-base font-bold text-navy-900">
        <span className="text-teal-600">{icon}</span>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Input({ label, type, required }: { label: string; type: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
      />
    </label>
  );
}
