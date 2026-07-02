import "@repo/tailwind-config/globals.css";
import { Toaster } from "@repo/ui";

import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Base Template",
  description:
    "Base Template Universal - Monorepo Turborepo + Next.js + Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
