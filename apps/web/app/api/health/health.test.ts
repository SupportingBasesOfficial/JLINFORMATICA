import { describe, expect, it } from "vitest";

import { GET } from "./route";

/**
 * Teste de exemplo — Route Handler /api/health.
 *
 * Demonstra o padrão para testar Route Handlers do Next.js:
 * 1. Importar o handler diretamente
 * 2. Chamar com request mock (quando o handler aceita parâmetros)
 * 3. Validar status, body e estrutura
 */
describe("GET /api/health", () => {
  it("retorna status 200 com timestamp ISO", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("healthy");
    expect(body.timestamp).toBeDefined();
    expect(() => new Date(body.timestamp).toISOString()).not.toThrow();
  });
});
