import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TabNav from "@/components/tab/TabNav";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jobarchitecture.arminoorata.com"),
  title: {
    default: "Job Architecture Toolkit",
    template: "%s · Job Architecture Toolkit",
  },
  description:
    "Free directional leveling tool and education for HRBPs, managers, and Total Rewards leaders. Built by Armi Noorata.",
  applicationName: "Job Architecture Toolkit",
  authors: [{ name: "Armi Noorata", url: "https://arminoorata.com" }],
  creator: "Armi Noorata",
  keywords: [
    "job architecture",
    "job leveling",
    "Radford",
    "Radford McLagan",
    "Total Rewards",
    "compensation",
    "career framework",
    "pay transparency",
  ],
  openGraph: {
    type: "website",
    url: "https://jobarchitecture.arminoorata.com",
    siteName: "Job Architecture Toolkit",
    title: "Job Architecture Toolkit",
    description:
      "Free directional leveling tool and education for HRBPs, managers, and Total Rewards leaders. Built by Armi Noorata.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Architecture Toolkit",
    description:
      "Free directional leveling tool and education for HRBPs, managers, and Total Rewards leaders. Built by Armi Noorata.",
    creator: "@arminoorata",
  },
};

const bootstrap = `(function(){try{var s=localStorage.getItem('theme');var t=s||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
      </head>
      <body className="min-h-full bg-background text-foreground font-sans">
        <SiteHeader />
        <TabNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
