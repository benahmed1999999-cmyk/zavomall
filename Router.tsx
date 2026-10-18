import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Route =
  | { name: "home" }
  | { name: "browse"; category?: string; country?: string; city?: string; q?: string }
  | { name: "shop"; slug: string }
  | { name: "product"; id: string }
  | { name: "login" }
  | { name: "register" }
  | { name: "dashboard" }
  | { name: "about" }
  | { name: "contact" }
  | { name: "privacy" }
  | { name: "terms" }
  | { name: "notFound" };

type RouterContextValue = {
  route: Route;
  navigate: (route: Route) => void;
};

const RouterContext = createContext<RouterContextValue | null>(null);

function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, "");
  if (!clean) return { name: "home" };
  const [path, queryStr] = clean.split("?");
  const segments = path.split("/").filter(Boolean);
  const params = new URLSearchParams(queryStr ?? "");
  if (segments.length === 0) return { name: "home" };

  switch (segments[0]) {
    case "browse": {
      return {
        name: "browse",
        category: params.get("category") ?? undefined,
        country: params.get("country") ?? undefined,
        city: params.get("city") ?? undefined,
        q: params.get("q") ?? undefined,
      };
    }
    case "shop":
      return { name: "shop", slug: decodeURIComponent(segments[1] ?? "") };
    case "product":
      return { name: "product", id: segments[1] ?? "" };
    case "login":
      return { name: "login" };
    case "register":
      return { name: "register" };
    case "dashboard":
      return { name: "dashboard" };
    case "about":
      return { name: "about" };
    case "contact":
      return { name: "contact" };
    case "privacy":
      return { name: "privacy" };
    case "terms":
      return { name: "terms" };
    default:
      return { name: "notFound" };
  }
}

export function routeToHash(route: Route): string {
  switch (route.name) {
    case "home":
      return "#/";
    case "browse": {
      const params = new URLSearchParams();
      if (route.category) params.set("category", route.category);
      if (route.country) params.set("country", route.country);
      if (route.city) params.set("city", route.city);
      if (route.q) params.set("q", route.q);
      const qs = params.toString();
      return qs ? `#/browse?${qs}` : "#/browse";
    }
    case "shop":
      return `#/shop/${encodeURIComponent(route.slug)}`;
    case "product":
      return `#/product/${route.id}`;
    case "login":
      return "#/login";
    case "register":
      return "#/register";
    case "dashboard":
      return "#/dashboard";
    case "about":
      return "#/about";
    case "contact":
      return "#/contact";
    case "privacy":
      return "#/privacy";
    case "terms":
      return "#/terms";
    default:
      return "#/404";
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (next: Route) => {
    const hash = routeToHash(next);
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    } else {
      setRoute(next);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const value = useMemo(() => ({ route, navigate }), [route]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}
