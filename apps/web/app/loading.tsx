/**
 * Loading UI global.
 *
 * Exibida automaticamente pelo Next.js enquanto Server Components carregam.
 * Evita tela branca durante streaming de dados (ex: supabase.auth.getUser()).
 */
export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="h-8 w-3/4 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      </div>
    </main>
  );
}
