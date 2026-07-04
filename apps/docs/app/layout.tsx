import Link from "next/link";

export const metadata = {
  title: "Base Template — Docs",
  description: "Documentação do Base Template Universal",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <nav
            style={{
              width: 240,
              borderRight: "1px solid #e5e5e5",
              padding: 24,
              fontSize: 14,
            }}
          >
            <h3 style={{ marginBottom: 16 }}>Base Template</h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                gap: 8,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <li>
                <Link href="/">Início</Link>
              </li>
              <li>
                <Link href="/architecture">Arquitetura</Link>
              </li>
              <li>
                <Link href="/setup">Setup</Link>
              </li>
              <li>
                <Link href="/contributing">Contribuir</Link>
              </li>
            </ul>
          </nav>
          <main style={{ flex: 1, padding: 24, maxWidth: 800 }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
