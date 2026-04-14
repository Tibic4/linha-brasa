import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, JetBrains_Mono } from "next/font/google";
import SchemaMarkup from "@/components/shared/SchemaMarkup";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://linhabrasa.com.br"),
  title: "Linha Brasa | Caldeira a Lenha para Piscinas — Aquecimento Econômico",
  description:
    "Caldeiras a lenha para aquecimento de piscinas fabricadas em Londrina/PR. Economize até 80% comparado ao gás. Modelos de 15.000 a 50.000 kcal/h. Produto único no Brasil.",
  keywords: [
    "caldeira a lenha",
    "aquecimento de piscina",
    "caldeira para piscina",
    "aquecedor de piscina a lenha",
    "linha brasa",
    "aquecimento econômico piscina",
  ],
  openGraph: {
    title: "Linha Brasa | Caldeira a Lenha para Piscinas",
    description:
      "Aqueça sua piscina gastando até 80% menos. Caldeiras a lenha fabricadas no Brasil com tecnologia premium.",
    type: "website",
    locale: "pt_BR",
    siteName: "Linha Brasa",
    images: [
      {
        url: "/images/og-image.jpg",
      // Real OG image generated — 1200x630
        width: 1200,
        height: 630,
        alt: "Linha Brasa — Caldeira a Lenha para Piscinas",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');`,
          }}
        />
        {/* Meta Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'PIXEL_ID_HERE');
fbq('track', 'PageView');`,
          }}
        />
      </head>
      <body
        className={`${bebas.variable} ${dmSans.variable} ${jetbrains.variable} font-dm bg-brasa-bg text-brasa-white antialiased`}
      >
        {/* GTM noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <SchemaMarkup />
        {children}
      </body>
    </html>
  );
}
