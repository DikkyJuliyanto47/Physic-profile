import { publicUrl } from "@/config/seo";
import { JsonLd } from "./JsonLd";

export function BreadcrumbJsonLd({ items }: {
  items: { name: string; path: string }[];
}) {
  if (!publicUrl("/")) return null;
  return <JsonLd data={{
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1,
      name: item.name, item: publicUrl(item.path),
    })),
  }} />;
}
