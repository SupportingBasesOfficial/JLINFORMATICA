import { NextResponse } from "next/server";

import { createClient } from "@repo/supabase/server";

/**
 * Auth callback — recebe o redirect do Supabase após login OAuth.
 *
 * Troca o code pela sessão, seta cookies SSR e redireciona para a home.
 * Necessário para OAuth providers (Google, GitHub, etc).
 *
 * Configurar no Supabase Dashboard → Authentication → URL Redirect:
 *   {NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback
 *   ou
 *   {APP_URL}/auth/callback
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // Redireciona para home com flag de erro se o exchange falhar
  return NextResponse.redirect(new URL(`/?error=auth`, requestUrl.origin));
}
