import { AlertCircle, Home } from "lucide-react";
import { RouterProvider, useRouter } from "@/router/router";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HomePage } from "@/pages/HomePage";
import { BrowsePage } from "@/pages/BrowsePage";
import { ShopPage } from "@/pages/ShopPage";
import { ProductPage } from "@/pages/ProductPage";
import { AuthPage } from "@/pages/AuthPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { StaticPage } from "@/pages/StaticPage";

function NotFoundPage() {
  const { navigate } = useRouter();
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
        <AlertCircle className="h-7 w-7" />
      </span>
      <h1 className="mt-4 text-2xl font-bold text-navy-900">404</h1>
      <p className="mt-2 text-sm text-slate-500">Page not found.</p>
      <button
        type="button"
        onClick={() => navigate({ name: "home" })}
        className="mt-6 flex items-center gap-1.5 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
      >
        <Home className="h-4 w-4" />
        Back to home
      </button>
    </div>
  );
}

function Routes() {
  const { route } = useRouter();

  switch (route.name) {
    case "home":
      return <HomePage />;
    case "browse":
      return <BrowsePage route={route} />;
    case "shop":
      return <ShopPage slug={route.slug} />;
    case "product":
      return <ProductPage id={route.id} />;
    case "login":
      return <AuthPage mode="login" />;
    case "register":
      return <AuthPage mode="register" />;
    case "dashboard":
      return <DashboardPage />;
    case "about":
      return <StaticPage page="about" />;
    case "contact":
      return <StaticPage page="contact" />;
    case "privacy":
      return <StaticPage page="privacy" />;
    case "terms":
      return <StaticPage page="terms" />;
    default:
      return <NotFoundPage />;
  }
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider>
          <div className="flex min-h-screen flex-col bg-white">
            <Header />
            <main className="flex-1">
              <Routes />
            </main>
            <Footer />
          </div>
        </RouterProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
