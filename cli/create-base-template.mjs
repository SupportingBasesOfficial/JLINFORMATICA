#!/usr/bin/env node

/**
 * create-base-template — CLI interativa para instanciar projetos.
 *
 * Uso: npx create-base-template meu-projeto
 *
 * Funciona como create-t3-app: pergunta nome, clona o template,
 * configura .env, e instala dependências.
 */

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { default as isInteractive } from "node:tty";

const TEMPLATE_REPO = "https://github.com/SupportingBasesOfficial/base-template.git";

const args = process.argv.slice(2);
const targetDir = args[0] ?? ".";

async function main() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  console.log("\n🚀 create-base-template\n");

  const projectName = await rl.question("Nome do projeto: ");
  const supabaseUrl = await rl.question("Supabase URL (deixe vazio para configurar depois): ");
  const supabaseKey = await rl.question("Supabase Anon Key (deixe vazio para configurar depois): ");

  rl.close();

  const dest = join(process.cwd(), targetDir === "." ? projectName : targetDir);

  if (existsSync(dest)) {
    console.error(`\n❌ Diretório "${dest}" já existe.`);
    process.exit(1);
  }

  console.log(`\n📦 Clonando template para ${dest}...`);
  execSync(`git clone --depth 1 ${TEMPLATE_REPO} "${dest}"`, { stdio: "inherit" });

  // Remove .git para novo histórico
  rmSync(join(dest, ".git"), { recursive: true, force: true });

  // Configura .env se fornecido
  if (supabaseUrl && supabaseKey) {
    const envPath = join(dest, "apps", "web", ".env");
    const envContent = `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}\n`;
    writeFileSync(envPath, envContent, "utf-8");
    console.log("✓ .env configurado");
  }

  // Atualiza package.json com o nome do projeto
  const pkgPath = join(dest, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  pkg.name = projectName;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");

  // Instala dependências
  console.log("\n📥 Instalando dependências...");
  execSync("pnpm install", { cwd: dest, stdio: "inherit" });

  console.log("\n✅ Projeto criado com sucesso!");
  console.log(`\n   cd ${targetDir === "." ? projectName : targetDir}`);
  console.log("   pnpm dev\n");
}

main().catch((err) => {
  console.error("\n❌ Erro:", err.message);
  process.exit(1);
});
