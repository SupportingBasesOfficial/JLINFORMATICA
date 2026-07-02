import Link from "next/link";

import { Button } from "@repo/ui";

/**
 * Página 404 global.
 *
 * Substitui a página 404 genérica do Next.js por uma com o design system.
 */
export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Voltar para o início</Link>
        </Button>
      </div>
    </main>
  );
}
