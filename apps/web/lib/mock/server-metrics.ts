// Mock data — métricas simuladas de servidores Windows Server
// Substituir por dados reais (Zabbix API, agente próprio, etc) na Phase 2

export interface ServerGroup {
  id: string;
  name: string;
}

export interface Server {
  id: string;
  name: string;
  groupId: string;
  groupName: string;
  hostname: string;
  ip: string;
  os: string;
  status: "online" | "offline" | "maintenance";
  lastBoot: string;
}

export interface KpiData {
  cpu: number;
  memory: number;
  uptimeDays: number;
  pendingUpdates: number;
  rebootPending: boolean;
}

export interface GaugeAverage {
  current: number;
  avg1: number;
  avg5: number;
  avg15: number;
}

export interface SparklinePoint {
  values: number[];
}

export interface DiskDrive {
  letter: string;
  label: string;
  utilization: number;
  totalBytes: number;
  usedBytes: number;
}

export interface DiskIopsPoint {
  read: number;
  write: number;
}

export interface DiskLatencyPoint {
  readMs: number;
  writeMs: number;
}

export interface DiskQueuePoint {
  read: number;
  write: number;
}

export interface WindowsService {
  name: string;
  displayName: string;
  status: "running" | "stopped";
}

export interface ProcessInfo {
  pid: number;
  name: string;
  cpuPercent: number;
  memMb: number;
}

export interface NetworkPoint {
  kbpsIn: number;
  kbpsOut: number;
  connections: number;
}

export type AlertSeverity = "critical" | "warning" | "info";

export interface AlertEvent {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: string;
  source: string;
}

export interface TreemapNode {
  name: string;
  value: number;
  children?: TreemapNode[];
}

export interface ServerMetrics {
  server: Server;
  kpi: KpiData;
  cpuGauge: GaugeAverage;
  memGauge: GaugeAverage;
  cpuQueue: number[];
  diskDrives: DiskDrive[];
  diskIops: DiskIopsPoint[];
  diskLatency: DiskLatencyPoint[];
  diskQueue: DiskQueuePoint[];
  diskLatencySummary: { readMs: number; writeMs: number };
  diskQueueSummary: { read: number; write: number };
  services: WindowsService[];
  processes: ProcessInfo[];
  network: NetworkPoint[];
  networkSummary: {
    avgInKbps: number;
    avgOutKbps: number;
    currentConnections: number;
  };
  alerts: AlertEvent[];
  treemap: TreemapNode[];
}

const GB = 1073741824;

export const serverGroups: ServerGroup[] = [
  { id: "grp-orbenk", name: "Orbenk" },
  { id: "grp-jlinf", name: "JL Informática" },
];

export const servers: Server[] = [
  {
    id: "srv-web01",
    name: "SRV-WEB01",
    groupId: "grp-orbenk",
    groupName: "Orbenk",
    hostname: "srv-web01.orbenk.local",
    ip: "192.168.10.21",
    os: "Windows Server 2022",
    status: "online",
    lastBoot: "2026-05-23T03:12:00Z",
  },
  {
    id: "srv-db01",
    name: "SRV-DB01",
    groupId: "grp-orbenk",
    groupName: "Orbenk",
    hostname: "srv-db01.orbenk.local",
    ip: "192.168.10.22",
    os: "Windows Server 2019",
    status: "online",
    lastBoot: "2026-06-01T08:30:00Z",
  },
  {
    id: "srv-app01",
    name: "SRV-APP01",
    groupId: "grp-jlinf",
    groupName: "JL Informática",
    hostname: "srv-app01.jlinf.local",
    ip: "192.168.20.11",
    os: "Windows Server 2022",
    status: "online",
    lastBoot: "2026-06-15T14:00:00Z",
  },
];

export const timeWindows = [
  { id: "1h", label: "Última 1h" },
  { id: "6h", label: "Últimas 6h" },
  { id: "24h", label: "Últimas 24h" },
  { id: "7d", label: "Últimos 7d" },
];

export function getServerMetrics(serverId: string): ServerMetrics {
  const server = servers.find((s) => s.id === serverId) ?? servers[0];

  return {
    server,
    kpi: {
      cpu: 42,
      memory: 67,
      uptimeDays: 47,
      pendingUpdates: 6,
      rebootPending: false,
    },
    cpuGauge: {
      current: 42,
      avg1: 44.2,
      avg5: 39.8,
      avg15: 35.1,
    },
    memGauge: {
      current: 67,
      avg1: 66.5,
      avg5: 65.9,
      avg15: 64.2,
    },
    cpuQueue: [50, 42, 45, 30, 35, 20, 28, 15, 25, 18, 22],
    diskDrives: [
      {
        letter: "C:",
        label: "Sistema",
        utilization: 62.4,
        totalBytes: 128 * GB,
        usedBytes: 80 * GB,
      },
      {
        letter: "D:",
        label: "Dados",
        utilization: 18.0,
        totalBytes: 512 * GB,
        usedBytes: 92 * GB,
      },
    ],
    diskIops: [
      { read: 45, write: 52 },
      { read: 40, write: 50 },
      { read: 42, write: 51 },
      { read: 30, write: 46 },
      { read: 35, write: 48 },
      { read: 20, write: 42 },
      { read: 28, write: 45 },
      { read: 15, write: 40 },
      { read: 25, write: 44 },
      { read: 18, write: 41 },
      { read: 10, write: 38 },
      { read: 16, write: 40 },
    ],
    diskLatency: [
      { readMs: 30, writeMs: 36 },
      { readMs: 28, writeMs: 35 },
      { readMs: 32, writeMs: 37 },
      { readMs: 15, writeMs: 34 },
      { readMs: 25, writeMs: 36 },
      { readMs: 10, writeMs: 32 },
      { readMs: 20, writeMs: 35 },
      { readMs: 5, writeMs: 30 },
      { readMs: 18, writeMs: 34 },
      { readMs: 8, writeMs: 31 },
      { readMs: 12, writeMs: 33 },
    ],
    diskQueue: [
      { read: 35, write: 40 },
      { read: 32, write: 39 },
      { read: 34, write: 40 },
      { read: 25, write: 37 },
      { read: 28, write: 38 },
      { read: 18, write: 35 },
      { read: 23, write: 37 },
      { read: 12, write: 33 },
      { read: 20, write: 36 },
      { read: 15, write: 34 },
      { read: 18, write: 35 },
    ],
    diskLatencySummary: { readMs: 2.4, writeMs: 1.1 },
    diskQueueSummary: { read: 0.18, write: 0.06 },
    network: [
      { kbpsIn: 12400, kbpsOut: 8200, connections: 142 },
      { kbpsIn: 11800, kbpsOut: 7600, connections: 138 },
      { kbpsIn: 13200, kbpsOut: 9100, connections: 145 },
      { kbpsIn: 10500, kbpsOut: 6800, connections: 130 },
      { kbpsIn: 14100, kbpsOut: 9800, connections: 152 },
      { kbpsIn: 9800, kbpsOut: 6200, connections: 125 },
      { kbpsIn: 12600, kbpsOut: 8400, connections: 140 },
      { kbpsIn: 11200, kbpsOut: 7400, connections: 134 },
      { kbpsIn: 13800, kbpsOut: 9200, connections: 148 },
      { kbpsIn: 10400, kbpsOut: 6900, connections: 131 },
      { kbpsIn: 12900, kbpsOut: 8500, connections: 143 },
      { kbpsIn: 12100, kbpsOut: 8000, connections: 139 },
    ],
    networkSummary: {
      avgInKbps: 12083,
      avgOutKbps: 8058,
      currentConnections: 139,
    },
    alerts: [
      {
        id: "evt-001",
        severity: "critical",
        title: "Serviço W3SVC parado",
        description:
          "World Wide Web Publishing Service foi interrompido inesperadamente",
        timestamp: "2026-07-10T20:42:00Z",
        source: "Windows Services",
      },
      {
        id: "evt-002",
        severity: "warning",
        title: "CPU acima de 70%",
        description: "Utilização de CPU atingiu 72.3% durante 5 minutos",
        timestamp: "2026-07-10T19:15:00Z",
        source: "Performance Monitor",
      },
      {
        id: "evt-003",
        severity: "warning",
        title: "Disco C: com pouco espaço",
        description: "Drive C: possui apenas 37.5% livre (48 GB de 128 GB)",
        timestamp: "2026-07-10T16:30:00Z",
        source: "Disk Monitor",
      },
      {
        id: "evt-004",
        severity: "info",
        title: "6 updates pendentes",
        description: "Atualizações do Windows Server aguardando instalação",
        timestamp: "2026-07-10T14:00:00Z",
        source: "Windows Update",
      },
      {
        id: "evt-005",
        severity: "info",
        title: "Reinicialização não pendente",
        description: "Sistema operacional não requer reinicialização",
        timestamp: "2026-07-10T08:00:00Z",
        source: "Windows Update",
      },
      {
        id: "evt-006",
        severity: "warning",
        title: "Latência de disco elevada",
        description: "Latência de gravação média acima de 35ms no drive D:",
        timestamp: "2026-07-09T22:10:00Z",
        source: "Disk Monitor",
      },
    ],
    services: [
      {
        name: "W3SVC",
        displayName: "World Wide Web Publishing Service",
        status: "stopped",
      },
      {
        name: "MSSQLSERVER",
        displayName: "SQL Server (MSSQLSERVER)",
        status: "running",
      },
      { name: "EventLog", displayName: "Windows Event Log", status: "running" },
      { name: "Spooler", displayName: "Print Spooler", status: "running" },
      {
        name: "BITS",
        displayName: "Background Intelligent Transfer Service",
        status: "running",
      },
      {
        name: "Winmgmt",
        displayName: "Windows Management Instrumentation",
        status: "running",
      },
      {
        name: "RpcSs",
        displayName: "Remote Procedure Call (RPC)",
        status: "running",
      },
      { name: "LanmanServer", displayName: "Server", status: "running" },
      {
        name: "LanmanWorkstation",
        displayName: "Workstation",
        status: "running",
      },
      { name: "Schedule", displayName: "Task Scheduler", status: "running" },
    ],
    processes: [
      { pid: 4212, name: "sqlservr", cpuPercent: 62.4, memMb: 1024 },
      { pid: 5588, name: "w3wp", cpuPercent: 28.1, memMb: 512 },
      { pid: 920, name: "System", cpuPercent: 4.2, memMb: 256 },
      { pid: 4, name: "System Idle Process", cpuPercent: 0.1, memMb: 8 },
      { pid: 3080, name: "Zabbix Agent 2", cpuPercent: 1.8, memMb: 48 },
      { pid: 1456, name: "svchost", cpuPercent: 2.3, memMb: 128 },
      { pid: 884, name: "lsass", cpuPercent: 0.5, memMb: 64 },
      { pid: 2244, name: "csrss", cpuPercent: 0.2, memMb: 32 },
    ],
    treemap: [
      {
        name: "C: (Sistema)",
        value: 84 * GB,
        children: [
          {
            name: "Windows",
            value: 32 * GB,
            children: [
              { name: "WinSxS", value: 14 * GB },
              { name: "System32", value: 9 * GB },
              { name: "SoftwareDistribution", value: 6 * GB },
              { name: "Temp", value: 3 * GB },
            ],
          },
          {
            name: "Users",
            value: 28 * GB,
            children: [
              { name: "Administrator", value: 16 * GB },
              { name: "jsilva", value: 8 * GB },
              { name: "Public", value: 4 * GB },
            ],
          },
          {
            name: "Program Files",
            value: 12 * GB,
            children: [
              { name: "Microsoft SQL Server", value: 8 * GB },
              { name: "Zabbix Agent 2", value: 1 * GB },
              { name: "IIS", value: 3 * GB },
            ],
          },
          { name: "JLTecnologia", value: 6 * GB },
          { name: "inetpub", value: 6 * GB },
        ],
      },
      {
        name: "D: (Dados)",
        value: 210 * GB,
        children: [
          { name: "Backups", value: 140 * GB },
          { name: "SQLData", value: 60 * GB },
          { name: "Logs", value: 10 * GB },
        ],
      },
    ],
  };
}

// Gera variacao leve nas metricas para simular auto-refresh
function jitter(base: number, pct: number): number {
  const delta = base * pct * (Math.random() * 2 - 1);
  return Math.max(0, base + delta);
}

export function applyVariation(metrics: ServerMetrics): ServerMetrics {
  const newCpu = jitter(metrics.cpuGauge.current, 0.08);
  const newMem = jitter(metrics.memGauge.current, 0.04);

  const shiftArray = <T>(arr: T[]): T[] => [...arr.slice(1), arr[0]];

  const lastIops = metrics.diskIops[metrics.diskIops.length - 1];
  const lastLat = metrics.diskLatency[metrics.diskLatency.length - 1];
  const lastQ = metrics.diskQueue[metrics.diskQueue.length - 1];
  const lastNet = metrics.network[metrics.network.length - 1];

  return {
    ...metrics,
    kpi: {
      ...metrics.kpi,
      cpu: newCpu,
      memory: newMem,
    },
    cpuGauge: {
      current: newCpu,
      avg1: jitter(metrics.cpuGauge.avg1, 0.03),
      avg5: jitter(metrics.cpuGauge.avg5, 0.02),
      avg15: jitter(metrics.cpuGauge.avg15, 0.01),
    },
    memGauge: {
      current: newMem,
      avg1: jitter(metrics.memGauge.avg1, 0.02),
      avg5: jitter(metrics.memGauge.avg5, 0.015),
      avg15: jitter(metrics.memGauge.avg15, 0.01),
    },
    cpuQueue: [...metrics.cpuQueue.slice(1), jitter(newCpu, 0.1)],
    diskIops: shiftArray(metrics.diskIops).map((p, i) =>
      i === metrics.diskIops.length - 1
        ? {
            read: jitter(lastIops.read, 0.15),
            write: jitter(lastIops.write, 0.15),
          }
        : p,
    ),
    diskLatency: shiftArray(metrics.diskLatency).map((p, i) =>
      i === metrics.diskLatency.length - 1
        ? {
            readMs: jitter(lastLat.readMs, 0.15),
            writeMs: jitter(lastLat.writeMs, 0.15),
          }
        : p,
    ),
    diskQueue: shiftArray(metrics.diskQueue).map((p, i) =>
      i === metrics.diskQueue.length - 1
        ? { read: jitter(lastQ.read, 0.15), write: jitter(lastQ.write, 0.15) }
        : p,
    ),
    network: shiftArray(metrics.network).map((p, i) =>
      i === metrics.network.length - 1
        ? {
            kbpsIn: jitter(lastNet.kbpsIn, 0.12),
            kbpsOut: jitter(lastNet.kbpsOut, 0.12),
            connections: Math.round(jitter(lastNet.connections, 0.05)),
          }
        : p,
    ),
    networkSummary: {
      avgInKbps: jitter(metrics.networkSummary.avgInKbps, 0.03),
      avgOutKbps: jitter(metrics.networkSummary.avgOutKbps, 0.03),
      currentConnections: Math.round(
        jitter(metrics.networkSummary.currentConnections, 0.04),
      ),
    },
    processes: metrics.processes.map((p) => ({
      ...p,
      cpuPercent: jitter(p.cpuPercent, 0.1),
      memMb: Math.round(jitter(p.memMb, 0.03)),
    })),
  };
}

// Calcula health score 0-100 baseado em CPU, memoria, disco e servicos
export function calculateHealthScore(metrics: ServerMetrics): number {
  const cpuScore = Math.max(0, 100 - metrics.cpuGauge.current * 1.2);
  const memScore = Math.max(0, 100 - metrics.memGauge.current * 1.1);
  const maxDiskUtil = Math.max(...metrics.diskDrives.map((d) => d.utilization));
  const diskScore = Math.max(0, 100 - maxDiskUtil * 0.8);
  const stoppedServices = metrics.services.filter(
    (s) => s.status === "stopped",
  ).length;
  const svcScore = Math.max(0, 100 - stoppedServices * 25);
  const rebootPenalty = metrics.kpi.rebootPending ? 10 : 0;
  const updatesPenalty = metrics.kpi.pendingUpdates * 2;

  const total =
    (cpuScore + memScore + diskScore + svcScore) / 4 -
    rebootPenalty -
    updatesPenalty;
  return Math.max(0, Math.min(100, Math.round(total)));
}

export function getHealthLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 80) return { label: "Saudável", color: "#3DD68C" };
  if (score >= 60) return { label: "Atenção", color: "#F5A623" };
  if (score >= 40) return { label: "Degradado", color: "#F5A623" };
  return { label: "Crítico", color: "#E5484D" };
}
