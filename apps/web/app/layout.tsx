import "@repo/tailwind-config/globals.css";
import { Toaster } from "@repo/ui";

import { ThemeProvider } from "@/components/theme-provider";
import { WebVitalsReporter } from "./web-vitals";

export const metadata = {
  title: {
    default: "JL Informática — Monitoramento",
    template: "%s — JL Informática",
  },
  description:
    "Painel executivo de monitoramento de infraestrutura Windows Server",
  applicationName: "JL Informática",
  authors: [{ name: "JL Informática" }],
  keywords: ["monitoramento", "windows server", "infraestrutura", "dashboard"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "JL Informática — Monitoramento",
    description: "Painel executivo de infraestrutura Windows Server",
    siteName: "JL Informática",
  },
  twitter: {
    card: "summary_large_image",
    title: "JL Informática — Monitoramento",
    description: "Painel executivo de infraestrutura Windows Server",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark">
      <body className="font-mono">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <WebVitalsReporter />
        </ThemeProvider>
      </body>
    </html>
  );
}
