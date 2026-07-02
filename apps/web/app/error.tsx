"use client";

import { useEffect } from "react";

import { Button } from "@repo/ui";

/**
 * Error boundary global.
 *
 * Captura erros de runtime em Server Components e exibe fallback.
 * O usuário pode tentar novamente sem recarregar a página inteira.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log do erro para observabilidade (substitua por @repo/logger quando implementado)
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Algo deu errado
        </h2>
        <p className="text-sm text-muted-foreground">
          Ocorreu um erro inesperado. Tente novamente.
        </p>
        <Button onClick={reset} variant="outline">
          Tentar novamente
        </Button>
      </div>
    </main>
  );
}
