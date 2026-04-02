import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from "recharts";
import {
  DollarSign, FileText, TrendingDown,
  RefreshCw, CreditCard, TrendingUp, Clock,
} from "lucide-react";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminCard from "../../../components/admin/AdminCard";
import {
  useFinancialStats,
  useRevenueByMonth,
  useApplicationsByMonth,
  useVisitorsByMonth,
} from "../../../hooks/useFinancials";

// ── Chart colour palette ──────────────────────────────────────
const COLORS = {
  blue:    "#3b82f6",
  violet:  "#8b5cf6",
  emerald: "#10b981",
  amber:   "#f59e0b",
  rose:    "#f43f5e",
  sky:     "#0ea5e9",
};

const PIE_COLORS = [COLORS.emerald, COLORS.blue, COLORS.sky, COLORS.rose, COLORS.amber, COLORS.violet];

// ── Custom Recharts tooltip ───────────────────────────────────
const ChartTooltip = ({ active, payload, label, prefix = "", suffix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs">
      <p className="font-bold text-slate-800 mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-bold text-slate-900">
            {prefix}{typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}{suffix}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── KPI Stat Card ─────────────────────────────────────────────
const StatCard = ({ label, value, change, trendUp, icon: Icon, color, bg, loading }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
    {/* Subtle background accent */}
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.06] -translate-y-4 translate-x-4 ${bg}`} />
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl ${bg} ${color} flex items-center justify-center border border-black/5`}>
        <Icon size={20} />
      </div>
      {change && (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
          trendUp ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
        }`}>
          {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {change}
        </span>
      )}
    </div>
    {loading ? (
      <div className="space-y-2">
        <div className="h-7 w-28 bg-slate-100 rounded-lg animate-pulse" />
        <div className="h-4 w-20 bg-slate-50 rounded animate-pulse" />
      </div>
    ) : (
      <div>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
        <p className="text-sm font-medium text-slate-500 mt-1">{label}</p>
      </div>
    )}
  </div>
);

// ── Chart skeleton loader ─────────────────────────────────────
const ChartSkeleton = ({ height = 280 }) => (
  <div style={{ height }} className="flex items-center justify-center">
    <div className="space-y-3 w-full px-4">
      <div className="flex items-end gap-3 justify-around" style={{ height: height - 60 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-slate-100 rounded-t-md animate-pulse"
            style={{ height: `${30 + Math.random() * 60}%` }}
          />
        ))}
      </div>
      <div className="h-3 bg-slate-100 rounded animate-pulse w-full" />
    </div>
  </div>
);

// ── Custom Pie label ──────────────────────────────────────────
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="700">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ═════════════════════════════════════════════════════════════
//  Page Component
// ═════════════════════════════════════════════════════════════

export default function FinancialReports() {
  const [timeFilter, setTimeFilter] = useState("all");

  const { data: stats, isLoading: statsLoading, refetch: refetchStats, isFetching: statsFetching } = useFinancialStats();
  const { data: revenueData = [], isLoading: revLoading, refetch: refetchRev, isFetching: revFetching } = useRevenueByMonth();
  const { data: appsData = [], isLoading: appsLoading, refetch: refetchApps, isFetching: appsFetching } = useApplicationsByMonth();
  const { data: visitorsData = [], isLoading: visLoading, refetch: refetchVis, isFetching: visFetching } = useVisitorsByMonth();

  const loading = statsLoading || revLoading || appsLoading || visLoading;
  const refreshing = statsFetching || revFetching || appsFetching || visFetching;

  const loadAll = () => {
    refetchStats();
    refetchRev();
    refetchApps();
    refetchVis();
  };

  // Filter chart data by time range
  const filteredRevenue = timeFilter === "all" ? revenueData : revenueData.slice(-parseInt(timeFilter));
  const filteredApps    = timeFilter === "all" ? appsData    : appsData.slice(-parseInt(timeFilter));
  const filteredVisitors = timeFilter === "all" ? visitorsData : visitorsData.slice(-parseInt(timeFilter));

  // Donut data: sum each status across all months
  const statusTotals = {
    Pending: 0,
    Reviewing: 0,
    "Needs Changes": 0,
    Approved: 0,
    Rejected: 0,
  };

  appsData.forEach((m) => {
    Object.keys(statusTotals).forEach((s) => {
      statusTotals[s] = (statusTotals[s] || 0) + (m[s] || 0);
    });
  });

  const donutData = Object.entries(statusTotals)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const kpiCards = stats
    ? [
        {
          label: "Current Revenue from Visa Consultation",
          value: stats.formatted.totalRevenue,
          change: "Total paid",
          trendUp: true,
          icon: DollarSign,
          color: "text-emerald-600",
          bg: "bg-emerald-50",
        },
        {
          label: "Total Transactions",
          value: stats.totalTransactions.toString(),
          change: "Paid transactions",
          trendUp: true,
          icon: FileText,
          color: "text-blue-600",
          bg: "bg-blue-50",
        },
        {
          label: "Avg. Consultation Fee",
          value: stats.formatted.avgFee,
          change: "Per paid case",
          trendUp: true,
          icon: CreditCard,
          color: "text-violet-600",
          bg: "bg-violet-50",
        },
        {
          label: "Pending Fees",
          value: stats.pendingCount.toString(),
          change: "Unpaid invoices",
          trendUp: false,
          icon: Clock,
          color: "text-amber-600",
          bg: "bg-amber-50",
        },
      ]
    : Array.from({ length: 4 }).map((_, i) => ({
        label: ["Current Revenue", "Transactions", "Avg. Fee", "Pending"][i],
        value: "—",
        icon: [DollarSign, FileText, CreditCard, Clock][i],
        color: ["text-emerald-600", "text-blue-600", "text-violet-600", "text-amber-600"][i],
        bg:    ["bg-emerald-50",   "bg-blue-50",   "bg-violet-50",   "bg-amber-50"][i],
      }));

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* ── Header ─────────────────────────────────────────────── */}
      <AdminPageHeader
        title="Financial Reports"
        subtitle="Visa consultation revenue, application trends, and platform analytics."
      />

      {/* ── Time filter + refresh ───────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[
            { label: "All Time", value: "all"  },
            { label: "6 Mo",     value: "6"    },
            { label: "3 Mo",     value: "3"    },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                timeFilter === opt.value
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          onClick={loadAll}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── KPI Stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpiCards.map((card, i) => (
          <StatCard key={i} {...card} loading={loading} />
        ))}
      </div>

      {/* ── Row 1: Bar chart + Donut chart ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Bar Chart — Revenue by Month (wider col) */}
        <AdminCard
          title="Visa Fee Revenue"
          className="lg:col-span-3"
          action={
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
              USD • Consultation Fees
            </span>
          }
        >
          {loading ? (
            <ChartSkeleton height={280} />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={filteredRevenue} barSize={20} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.blue} stopOpacity={1} />
                    <stop offset="100%" stopColor={COLORS.violet} stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v}`} />
                <Tooltip content={<ChartTooltip prefix="$" />} cursor={{ fill: "#f8fafc", radius: 8 }} />
                <Bar dataKey="revenue" name="Revenue" fill="url(#revenueGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </AdminCard>

        {/* Donut Chart — Applications by Status */}
        <AdminCard
          title="Uni. Apps by Status"
          className="lg:col-span-2"
          action={
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
              All Time
            </span>
          }
        >
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border-8 border-slate-100 animate-pulse" />
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={renderPieLabel}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {donutData.map((entry, index) => {
                       let c = PIE_COLORS[index % PIE_COLORS.length];
                       if (entry.name === "Approved") c = COLORS.emerald;
                       if (entry.name === "Pending") c = COLORS.sky;
                       if (entry.name === "Reviewing") c = COLORS.blue;
                       if (entry.name === "Needs Changes") c = COLORS.amber;
                       if (entry.name === "Rejected") c = COLORS.rose;
                       return <Cell key={index} fill={c} />;
                    })}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 text-xs font-semibold text-slate-600">
                <span>Pending ({statusTotals.Pending})</span>
                <span>Reviewing ({statusTotals.Reviewing})</span>
                <span>Needs Changes ({statusTotals["Needs Changes"]})</span>
                <span>Approved ({statusTotals.Approved})</span>
                <span>Rejected ({statusTotals.Rejected})</span>
              </div>
            </>
          )}
        </AdminCard>
      </div>

      {/* ── Row 2: Applications per Month (stacked bars) ─────────── */}
      <AdminCard
        title="Uni. Apps Timeline"
        action={
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
            By Status
          </span>
        }
      >
        {loading ? (
          <ChartSkeleton height={260} />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={filteredApps} barSize={14} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>{v}</span>} />
              <Bar dataKey="Pending"       name="Pending"       stackId="a" fill={COLORS.sky}     radius={[0, 0, 0, 0]} />
              <Bar dataKey="Reviewing"     name="Reviewing"     stackId="a" fill={COLORS.blue}    radius={[0, 0, 0, 0]} />
              <Bar dataKey="Needs Changes" name="Needs Changes" stackId="a" fill={COLORS.amber}   radius={[0, 0, 0, 0]} />
              <Bar dataKey="Approved"      name="Approved"      stackId="a" fill={COLORS.emerald} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Rejected"      name="Rejected"      stackId="a" fill={COLORS.rose}    radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </AdminCard>

      {/* ── Row 3: Visitors per Month ───────────────────────────── */}
      <AdminCard
        title="Platform Visitors per Month"
        action={
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
            Live Analytics
          </span>
        }
      >
        {loading ? (
          <ChartSkeleton height={220} />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={filteredVisitors} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={COLORS.violet} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={COLORS.violet} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v}`} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="visitors"
                name="Visitors"
                stroke={COLORS.violet}
                strokeWidth={2.5}
                fill="url(#visitorGrad)"
                dot={false}
                activeDot={{ r: 5, fill: COLORS.violet, stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </AdminCard>

    </div>
  );
}
