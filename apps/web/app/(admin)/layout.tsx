"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { serverGroups, servers } from "@/lib/mock/server-metrics";

const STATUS_COLORS: Record<string, string> = {
  online: "#3DD68C",
  offline: "#E5484D",
  maintenance: "#F5A623",
};

/**
 * Admin layout — Painel de monitoramento JL Informática.
 * Sidebar com navegacao + arvore de servidores agrupados por grupo.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/servers", label: "Servidores" },
    { href: "/dashboard/alerts", label: "Alertas" },
    { href: "/dashboard/settings", label: "Configurações" },
  ];

  return (
    <div className="min-h-screen flex bg-jl-bg">
      {/* Sidebar */}
      <aside className="w-60 border-r border-jl-border bg-jl-card/50 p-3 flex flex-col">
        {/* Logo */}
        <div className="mb-5 px-2">
          <h2 className="text-base font-bold text-jl-text">JL Informática</h2>
          <p className="text-[10px] text-jl-muted mt-0.5">Monitoramento v1.0</p>
        </div>

        {/* Navegacao */}
        <nav className="space-y-0.5 mb-5">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  active
                    ? "bg-jl-teal/15 text-jl-teal border-l-2 border-jl-teal"
                    : "text-jl-muted hover:bg-jl-card hover:text-jl-text"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Arvore de servidores */}
        <div className="flex-1 overflow-y-auto jl-scroll">
          <div className="text-jl-muted text-[9px] font-bold tracking-wide px-2 mb-2">
            SERVIDORES
          </div>
          {serverGroups.map((group) => {
            const groupServers = servers.filter((s) => s.groupId === group.id);
            return (
              <div key={group.id} className="mb-3">
                <div className="flex items-center gap-1.5 px-2 mb-1">
                  <span className="text-jl-muted text-[10px] font-bold">
                    {group.name}
                  </span>
                  <span className="text-jl-muted/50 text-[8px]">
                    ({groupServers.length})
                  </span>
                </div>
                <div className="space-y-0.5">
                  {groupServers.map((srv) => {
                    const active = pathname === "/dashboard";
                    return (
                      <Link
                        key={srv.id}
                        href="/dashboard"
                        className={`flex items-center gap-2 rounded px-2 py-1.5 text-[11px] transition-colors ${
                          active
                            ? "bg-white/5 text-jl-text"
                            : "text-jl-muted hover:bg-white/[0.03] hover:text-jl-text"
                        }`}
                      >
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: STATUS_COLORS[srv.status],
                            boxShadow: `0 0 4px ${STATUS_COLORS[srv.status]}`,
                          }}
                        />
                        <span className="truncate">{srv.name}</span>
                        <span className="ml-auto text-[8px] text-jl-muted/50">
                          {srv.os.includes("2022") ? "22" : "19"}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer sidebar */}
        <div className="border-t border-jl-border pt-2 mt-2 px-2">
          <div className="text-jl-muted text-[8px]">
            3 servidores · 2 grupos
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
