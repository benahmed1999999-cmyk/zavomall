import {
  Shirt,
  Laptop,
  Smartphone,
  Sofa,
  Sparkles,
  Dumbbell,
  ShoppingBasket,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Shirt,
  Laptop,
  Smartphone,
  Sofa,
  Sparkles,
  Dumbbell,
  ShoppingBasket,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? ShoppingBasket;
  return <Icon className={className} />;
}
