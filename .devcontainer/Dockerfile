FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# Supabase CLI — instalada globalmente para sync-db e migrations
RUN curl -sSL https://supabase.com/install/cli.sh | bash && \
    mv /usr/local/bin/supabase /usr/local/bin/supabase || true

# Vercel CLI — para deploy e preview via CLI
RUN npm install -g vercel
