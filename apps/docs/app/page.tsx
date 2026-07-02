export default function DocsHome() {
  return (
    <div>
      <h1>Base Template Universal</h1>
      <p>
        O template definitivo para projetos que escalam do MVP ao Enterprise.
        Monorepo Turborepo + Next.js 15 + Supabase Cloud + TypeScript 5.9.
      </p>

      <h2>Stack</h2>
      <ul>
        <li>
          <strong>Build:</strong> Turborepo
        </li>
        <li>
          <strong>App:</strong> Next.js 15 (App Router)
        </li>
        <li>
          <strong>UI:</strong> Tailwind v3 + shadcn/ui
        </li>
        <li>
          <strong>Data:</strong> Supabase Cloud
        </li>
        <li>
          <strong>Types:</strong> TypeScript 5.9 (tipos gerados do banco)
        </li>
        <li>
          <strong>Test:</strong> Vitest + Playwright
        </li>
        <li>
          <strong>Deploy:</strong> Vercel
        </li>
        <li>
          <strong>Dev:</strong> GitHub Codespaces
        </li>
      </ul>

      <h2>Começar</h2>
      <p>
        Veja o <a href="/setup">guia de setup</a> para instanciar um novo
        projeto.
      </p>
    </div>
  );
}
