#!/usr/bin/env node

/**
 * sync-db.mjs — Sincroniza tipos TypeScript do Supabase Cloud.
 *
 * 100% cloud workflow. Sem Docker local. Sem supabase start.
 * Conecta direto ao projeto Supabase Cloud usando --project-ref.
 *
 * Uso:
 *   node sync-db.mjs                    # Usa SUPABASE_PROJECT_REF do env
 *   node sync-db.mjs --project-ref xxx  # Override inline
 *
 * Requer:
 *   - Supabase CLI instalada (npx supabase)
 *   - SUPABASE_PROJECT_REF definido (ref do projeto no dashboard Supabase)
 *   - SUPABASE_ACCESS_TOKEN definido (token da CLI) OU login interativo prévio
 */

import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "packages/supabase/src/database.types.ts");

// Carrega variaveis de apps/web/.env se existir (dev local)
// Codespaces secrets ja estao no process.env e tem prioridade
const envPath = resolve(__dirname, "apps/web/.env");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}

// Parse --project-ref argument
const args = process.argv.slice(2);
const refIndex = args.indexOf("--project-ref");
const projectRef =
  refIndex !== -1 ? args[refIndex + 1] : process.env.SUPABASE_PROJECT_REF;

if (!projectRef) {
  console.error(
    "ERRO: SUPABASE_PROJECT_REF nao definido.\n" +
      "Defina no .env ou passe via --project-ref <ref>.\n" +
      "Encontre o ref no dashboard: Supabase > Project Settings > General > Reference ID.",
  );
  process.exit(1);
}

console.log("--- Iniciando Sincronizacao (Cloud) ---");
console.log(`Project ref: ${projectRef}`);

// Gera tipos do TypeScript direto do Supabase Cloud
console.log("1. Gerando tipos do Supabase Cloud...");
try {
  const types = execSync(
    `npx supabase gen types typescript --project-ref ${projectRef}`,
    { encoding: "utf-8", cwd: __dirname },
  );

  // Escreve o arquivo sem BOM
  writeFileSync(outputPath, types, { encoding: "utf-8" });
  console.log(`   Tipos escritos em: packages/supabase/src/database.types.ts`);
} catch (error) {
  console.error("ERRO: Falha ao gerar tipos. Verifique:");
  console.error("   - Supabase CLI instalada (npx supabase --version)");
  console.error("   - Token valido (npx supabase login)");
  console.error("   - Project ref correto");
  process.exit(1);
}

// Valida os tipos gerados
console.log("2. Validando tipos TypeScript...");
try {
  execSync('pnpm check-types --filter "@repo/supabase"', {
    stdio: "pipe",
    cwd: __dirname,
  });
  console.log("   TypeScript: OK");
} catch {
  console.warn("   AVISO: check-types falhou apos sync. Verificar manualmente.");
}

console.log("OK: Sincronizacao Concluida!");
