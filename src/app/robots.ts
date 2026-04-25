import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/checkout", "/obrigado"],
    },
    sitemap: "https://caldeira-showcase.vercel.app/sitemap.xml",
  };
}
