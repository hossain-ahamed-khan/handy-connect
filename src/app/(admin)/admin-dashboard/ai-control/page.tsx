"use client";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
type Tab = "Overview" | "Prompt Manager" | "Price Database" | "Price Index" | "Testing" | "Feedback";

// ── Tiny helpers ───────────────────────────────────────────────────────────────
const StarRow = ({ rating, max = 5, size = "sm" }: { rating: number; max?: number; size?: "sm" | "lg" }) => {
    const sz = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: max }).map((_, i) => (
                <svg key={i} className={`${sz} ${i < Math.round(rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

const ProgressBar = ({ value, max = 5, color = "bg-amber-400" }: { value: number; max?: number; color?: string }) => (
    <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full`} style={{ width: `${(value / max) * 100}%` }} />
    </div>
);

const Badge = ({ children, color }: { children: React.ReactNode; color: string }) => (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{children}</span>
);

const TrendUp = () => (
    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);
const TrendDown = () => (
    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17H5m0 0V9m0 8l8-8 4 4 6-6" />
    </svg>
);

// ── Tab: Overview ──────────────────────────────────────────────────────────────
const diagnoses = [
    { job: "JOB-1234", issue: "Leaking pipe", predicted: "Worn seal", professional: "Worn seal", confidence: 92, color: "bg-emerald-400" },
    { job: "JOB-1235", issue: "No power", predicted: "Circuit breaker", professional: "Circuit breaker", confidence: 78, color: "bg-red-400" },
    { job: "JOB-1236", issue: "AC not cooling", predicted: "Low refrigerant", professional: "Low refrigerant", confidence: 86, color: "bg-amber-400" },
    { job: "JOB-1237", issue: "Clogged drain", predicted: "Hair buildup", professional: "Hair buildup", confidence: 95, color: "bg-emerald-400" },
    { job: "JOB-1238", issue: "Flickering lights", predicted: "Loose connection", professional: "Loose connection", confidence: 91, color: "bg-emerald-400" },
];

const OverviewTab = () => (
    <div className="grid grid-cols-3 gap-5">
        {/* Left column */}
        <div className="col-span-2 space-y-5">
            {/* KPI row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 bg-amber-400 rounded-2xl p-5 flex flex-col justify-between min-h-[120px]">
                    <p className="text-amber-900 text-xs font-semibold tracking-wide uppercase">Overall Accuracy</p>
                    <div className="flex items-end justify-between">
                        <p className="text-4xl font-bold text-white">94.2%</p>
                        <svg className="w-12 h-12 text-amber-300 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col justify-between">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Total Diagnoses</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-bold text-gray-800">12,458</p>
                        <TrendUp />
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col justify-between">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Top Issue Detected</p>
                    <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-emerald-500">Leaking pipe</p>
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Recent Diagnoses */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Diagnoses</h3>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-50">
                            <th className="text-left pb-2 font-medium">Job</th>
                            <th className="text-left pb-2 font-medium">Issue</th>
                            <th className="text-left pb-2 font-medium">Predicted</th>
                            <th className="text-left pb-2 font-medium">Professional</th>
                            <th className="text-left pb-2 font-medium">Confidence</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {diagnoses.map((d) => (
                            <tr key={d.job} className="hover:bg-gray-50/50">
                                <td className="py-3 text-blue-500 font-medium">{d.job}</td>
                                <td className="py-3 text-gray-700">{d.issue}</td>
                                <td className="py-3 text-gray-500">{d.predicted}</td>
                                <td className="py-3 text-gray-500">{d.professional}</td>
                                <td className="py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-20 bg-gray-100 rounded-full h-1.5">
                                            <div className={`${d.color} h-1.5 rounded-full`} style={{ width: `${d.confidence}%` }} />
                                        </div>
                                        <span className="text-gray-500 text-xs">{d.confidence}%</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
            {/* AI Estimate Ratings */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-semibold text-gray-800 text-sm">AI Estimate Ratings</h3>
                        <p className="text-gray-400 text-xs mt-0.5">Rated by verified professionals</p>
                    </div>
                    <Badge color="bg-emerald-50 text-emerald-600">✓ Verified</Badge>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold text-gray-800">4.3</span>
                    <span className="text-gray-400 text-sm">/5</span>
                </div>
                <StarRow rating={4.3} size="lg" />
                <p className="text-gray-400 text-xs mt-1 mb-4">Based on 1,247 professional reviews</p>
                <div className="space-y-3">
                    {[
                        { label: "Diagnosis Accuracy", value: 4.5 },
                        { label: "Cost Estimation", value: 4.1 },
                        { label: "Issue Severity", value: 4.4 },
                        { label: "Parts Recommendation", value: 3.9 },
                    ].map((r) => (
                        <div key={r.label}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-600">{r.label}</span>
                                <span className="text-gray-400">{r.value}</span>
                            </div>
                            <ProgressBar value={r.value} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bill Comparison */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-800 text-sm">Bill Comparison</h3>
                    <Badge color="bg-emerald-50 text-emerald-600">89.8% accurate</Badge>
                </div>
                <p className="text-gray-400 text-xs mb-2">AI Estimate vs Actual Bills</p>
                <p className="text-blue-500 text-xs mb-4">Comparing JOB-1234</p>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-gray-400 text-xs">
                            <th className="text-right pb-1 font-medium">AI Est.</th>
                            <th className="text-right pb-1 font-medium">Cust Bill</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {[["$120", "$135"], ["$45", "$52"], ["$30", "$30"]].map(([ai, cust], i) => (
                            <tr key={i}>
                                <td className="py-2 text-right text-gray-600">{ai}</td>
                                <td className="py-2 text-right text-gray-600">{cust}</td>
                            </tr>
                        ))}
                        <tr className="font-semibold">
                            <td className="pt-2 text-right text-gray-800">$195</td>
                            <td className="pt-2 text-right text-gray-800">$217</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

// ── Tab: Prompt Manager ────────────────────────────────────────────────────────
const PromptManagerTab = () => (
    <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h3 className="font-semibold text-gray-800">System Prompt Editor</h3>
                        <p className="text-gray-400 text-xs mt-0.5">Configure the core instructions for the AI model.</p>
                    </div>
                    <Badge color="bg-emerald-50 text-emerald-600">Active (v2.4)</Badge>
                </div>
                <textarea
                    className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 h-40"
                    defaultValue="You are an expert service estimation AI. Analyze the provided issue description, location, and service type to estimate costs. Always reference the connected Price Database for regional pricing. If confidence is below 80%, flag for manual review."
                />
                <div className="flex justify-end gap-3 mt-3">
                    <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Save as Draft</button>
                    <button className="px-4 py-2 text-sm bg-amber-400 text-white rounded-lg font-medium hover:bg-amber-500">Deploy Prompt</button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-semibold text-gray-800">Price Estimation Rules</h3>
                        <p className="text-gray-400 text-xs mt-0.5">Hardcoded overrides and manual rules.</p>
                    </div>
                    <button className="text-sm text-amber-500 font-medium hover:text-amber-600">+ Add Rule</button>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-50">
                            {["Service Type", "Area/City", "Rate", "Source", "Actions"].map(h => (
                                <th key={h} className="text-left pb-2 font-medium">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {[
                            { service: "Plumber", area: "Berlin", rate: "50€/hour", source: "Manual" },
                            { service: "Electrician", area: "Munich", rate: "65€/hour", source: "Manual" },
                            { service: "HVAC", area: "Hamburg", rate: "55€/hour", source: "Auto-DB" },
                        ].map((r) => (
                            <tr key={r.service} className="hover:bg-gray-50/50">
                                <td className="py-3 text-gray-700 font-medium">{r.service}</td>
                                <td className="py-3 text-gray-500">{r.area}</td>
                                <td className="py-3 text-gray-700">{r.rate}</td>
                                <td className="py-3">
                                    <Badge color={r.source === "Manual" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"}>{r.source}</Badge>
                                </td>
                                <td className="py-3">
                                    <div className="flex gap-2 text-gray-400">
                                        <button className="hover:text-gray-600">✏️</button>
                                        <button className="hover:text-red-500">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-3">Database Connection</h3>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                        <span className="text-sm font-medium text-emerald-700">Connected to Price DB</span>
                    </div>
                    <p className="text-xs text-emerald-500 mt-1 ml-4">Last synced: 2 mins ago</p>
                </div>
                <button className="w-full border border-gray-200 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50">Force Sync Now</button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Prompt History</h3>
                <div className="space-y-4">
                    {[
                        { version: "v2.4", active: true, time: "Today, 10:42 AM", by: "System Admin" },
                        { version: "v2.3", active: false, time: "Yesterday, 14:20 PM", by: "Jane Doe" },
                        { version: "v2.2", active: false, time: "Oct 12, 09:15 AM", by: "John Smith" },
                    ].map((h) => (
                        <div key={h.version} className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm text-gray-700">{h.version}</span>
                                    {h.active && <Badge color="bg-emerald-50 text-emerald-600">Active</Badge>}
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{h.time}</p>
                                <p className="text-xs text-gray-400">by {h.by}</p>
                            </div>
                            <button className="text-xs text-blue-500 hover:underline">View Diff</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// ── Tab: Price Database ────────────────────────────────────────────────────────
const PriceDatabaseTab = () => (
    <div className="space-y-5">
        <div className="grid grid-cols-3 gap-4">
            {[
                { value: "8,432", label: "Customer Bill Uploads", badge: "+124 this week", color: "text-emerald-500" },
                { value: "3,194", label: "SP Price Ratings", badge: "Avg 4.3/5", color: "text-amber-500" },
                { value: "5,201", label: "SP Offers/Bills", badge: "+45 this week", color: "text-emerald-500" },
            ].map((k) => (
                <div key={k.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">📊</div>
                        <span className={`text-xs font-medium ${k.color}`}>{k.badge}</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{k.value}</p>
                    <p className="text-gray-400 text-xs mt-1">{k.label}</p>
                </div>
            ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex justify-between items-center mb-5">
                <h3 className="font-semibold text-gray-800">Price Databank</h3>
                <div className="flex gap-3">
                    <input className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" placeholder="Search services, areas..." />
                    <button className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">↓ Export</button>
                    <button className="bg-amber-400 text-white rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-amber-500">+ Add Entry</button>
                </div>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                        {["Service", "Area", "Price Range", "Avg Price", "Data Points", "Last Updated", "Source"].map(h => (
                            <th key={h} className="text-left pb-3 font-medium">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {[
                        { service: "Pipe Repair", area: "Berlin", range: "45€-80€", avg: "55€/hr", points: 342, updated: "Today", source: "Auto (Bills)", srcColor: "bg-blue-50 text-blue-600" },
                        { service: "Circuit Breaker", area: "Munich", range: "60€-120€", avg: "85€/hr", points: 156, updated: "Yesterday", source: "Auto (Offers)", srcColor: "bg-purple-50 text-purple-600" },
                        { service: "AC Maintenance", area: "Hamburg", range: "50€-90€", avg: "65€/hr", points: 89, updated: "Oct 12", source: "Mixed", srcColor: "bg-orange-50 text-orange-600" },
                        { service: "Drain Cleaning", area: "Frankfurt", range: "40€-70€", avg: "50€/hr", points: 12, updated: "Oct 10", source: "Manual", srcColor: "bg-amber-50 text-amber-600" },
                        { service: "Light Fixture", area: "Berlin", range: "35€-60€", avg: "45€/hr", points: 412, updated: "Today", source: "Auto (Bills)", srcColor: "bg-blue-50 text-blue-600" },
                    ].map((r) => (
                        <tr key={r.service} className="hover:bg-gray-50/50">
                            <td className="py-3 text-gray-700 font-medium">{r.service}</td>
                            <td className="py-3 text-gray-500">{r.area}</td>
                            <td className="py-3 text-gray-500">{r.range}</td>
                            <td className="py-3 font-semibold text-gray-700">{r.avg}</td>
                            <td className="py-3 text-gray-500">{r.points}</td>
                            <td className="py-3 text-gray-500">{r.updated}</td>
                            <td className="py-3"><Badge color={r.srcColor}>{r.source}</Badge></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                <span>Showing 1 to 5 of 1,248 entries</span>
                <div className="flex gap-1">
                    {["Prev", "1", "2", "3", "Next"].map((p) => (
                        <button key={p} className={`px-3 py-1 rounded-lg text-xs ${p === "1" ? "bg-amber-400 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{p}</button>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// ── Tab: Price Index ───────────────────────────────────────────────────────────
const PriceIndexTab = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const lines = [
        { color: "#10b981", data: [60, 61, 62, 63, 65, 68] },
        { color: "#8b5cf6", data: [55, 57, 59, 60, 61, 62] },
        { color: "#3b82f6", data: [45, 46, 47, 48, 49, 51] },
    ];
    const W = 500, H = 160, pad = 20;
    const allVals = lines.flatMap(l => l.data);
    const min = Math.min(...allVals) - 5, max = Math.max(...allVals) + 5;
    const x = (i: number) => pad + i * (W - 2 * pad) / 5;
    const y = (v: number) => H - pad - (v - min) / (max - min) * (H - 2 * pad);
    const linePath = (data: number[]) => data.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");

    return (
        <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-gray-800">National Price Index</h3>
                    <p className="text-gray-400 text-xs mt-0.5">Automatically generated from bill uploads and SP ratings</p>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-bold text-gray-800">104.2</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                        <TrendUp />
                        <span className="text-emerald-500 text-sm font-medium">+4.2% YoY</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: "Plumbing", value: 108.5, change: "+8.5%", up: true },
                    { label: "Electrical", value: 102.1, change: "+2.1%", up: true },
                    { label: "HVAC", value: 112.4, change: "+12.4%", up: true },
                    { label: "Carpentry", value: 98.5, change: "-1.5%", up: false },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                        <p className="text-gray-400 text-xs mb-2">{s.label}</p>
                        <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                            {s.up ? <TrendUp /> : <TrendDown />}
                            <span className={`text-xs font-medium ${s.up ? "text-emerald-500" : "text-red-400"}`}>{s.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-semibold text-gray-800 mb-4">Index History (6 Months)</h3>
                    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
                        {[60, 50, 40].map(v => (
                            <line key={v} x1={pad} y1={y(v)} x2={W - pad} y2={y(v)} stroke="#f3f4f6" strokeWidth="1" />
                        ))}
                        {[60, 50, 40].map(v => (
                            <text key={v} x={pad - 5} y={y(v) + 4} fontSize="9" fill="#9ca3af" textAnchor="end">{v}</text>
                        ))}
                        {months.map((m, i) => (
                            <text key={m} x={x(i)} y={H} fontSize="9" fill="#9ca3af" textAnchor="middle">{m}</text>
                        ))}
                        {lines.map((l, li) => (
                            <g key={li}>
                                <path d={linePath(l.data)} fill="none" stroke={l.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                {l.data.map((v, i) => (
                                    <circle key={i} cx={x(i)} cy={y(v)} r="3" fill="white" stroke={l.color} strokeWidth="2" />
                                ))}
                            </g>
                        ))}
                    </svg>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-semibold text-gray-800 mb-4">Regional Highlights</h3>
                    <div className="space-y-3">
                        {[
                            { city: "Munich", pct: "+15%", color: "text-emerald-500" },
                            { city: "Berlin", pct: "+5%", color: "text-amber-500" },
                            { city: "Hamburg", pct: "+8%", color: "text-amber-500" },
                            { city: "Leipzig", pct: "-2%", color: "text-red-400" },
                        ].map((r) => (
                            <div key={r.city} className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm">{r.city}</span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-semibold ${r.color}`}>{r.pct}</span>
                                    <span className="text-gray-300 text-xs">vs Nat. Avg</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Tab: Testing ───────────────────────────────────────────────────────────────
const TestingTab = () => (
    <div>
        <div className="flex justify-between items-center mb-5">
            <div>
                <h3 className="font-semibold text-gray-800">AI Playground</h3>
                <p className="text-gray-400 text-xs mt-0.5">Test prompts and price estimation logic before deploying.</p>
            </div>
            <div className="flex gap-3">
                <button className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Model: GPT-4 (Production) ▾</button>
                <button className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">⇄ Compare Mode</button>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <h4 className="font-medium text-gray-700">Test Input</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Service Category</label>
                        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                            <option>Plumbing</option>
                            <option>Electrical</option>
                            <option>HVAC</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Location</label>
                        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" defaultValue="Berlin" />
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Customer Issue Description</label>
                    <textarea className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300"
                        defaultValue="Water is leaking from under the kitchen sink. It seems to be coming from the U-shaped pipe. It's a steady drip." />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Additional Context (Optional)</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300" placeholder="e.g. Emergency call, weekend rate" />
                </div>
                <div className="flex justify-between items-center pt-2">
                    <button className="text-sm text-gray-400 hover:text-gray-600">↺ Reset</button>
                    <button className="bg-amber-400 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-amber-500">▶ Run Test</button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h4 className="font-medium text-gray-700 mb-4">AI Output</h4>
                <div className="border border-gray-100 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-400">Diagnosis</span>
                        <Badge color="bg-emerald-50 text-emerald-600">✓ 94% Confidence</Badge>
                    </div>
                    <h5 className="font-semibold text-gray-800">Leaking P-Trap (Under Sink)</h5>
                    <p className="text-gray-500 text-sm mt-1">Requires replacement of PVC P-trap assembly and sealing.</p>
                </div>
                <div className="border border-gray-100 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-400">Price Estimation</span>
                        <Badge color="bg-blue-50 text-blue-600">Based on 142 local bills</Badge>
                    </div>
                    <p className="text-3xl font-bold text-gray-800 mb-3">85€ – 120€</p>
                    <div className="space-y-1 text-sm">
                        {[
                            ["Labor (1 hr):", "65€"],
                            ["Parts (P-Trap kit):", "20€ – 35€"],
                            ["Call-out fee:", "Included"],
                        ].map(([k, v]) => (
                            <div key={k} className="flex justify-between text-gray-600">
                                <span>{k}</span><span>{v}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <p className="text-amber-700 text-xs">⚠ Note: If water damage has occurred to the cabinet base, additional carpentry work may be required (not included in this estimate).</p>
                </div>
            </div>
        </div>
    </div>
);

// ── Tab: Feedback ──────────────────────────────────────────────────────────────
const FeedbackTab = () => (
    <div className="space-y-5">
        <div className="grid grid-cols-4 gap-4">
            {[
                { label: "Avg SP Rating", value: "4.3", sub: "/5.0", stars: true },
                { label: "Total Feedback", value: "1,247", sub: "+12% this month", green: true },
                { label: "Accuracy Flags", value: "24", sub: "Requires manual review", warn: true },
                { label: "Model Updates", value: "12", sub: "Triggered by feedback", warn: true },
            ].map((k) => (
                <div key={k.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <p className="text-gray-400 text-xs mb-1">{k.label}</p>
                    <div className="flex items-baseline gap-1">
                        <p className={`text-3xl font-bold ${k.warn ? "text-amber-500" : "text-gray-800"}`}>{k.value}</p>
                        {k.sub && !k.stars && <p className={`text-xs ${k.green ? "text-emerald-500" : k.warn ? "text-gray-400" : "text-gray-400"}`}>{k.sub}</p>}
                    </div>
                    {k.stars && (
                        <>
                            <StarRow rating={4.3} size="lg" />
                        </>
                    )}
                </div>
            ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Recent SP Feedback</h3>
                <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
                    <option>All Ratings</option>
                    <option>5 Stars</option>
                    <option>Low Ratings</option>
                </select>
            </div>
            <div className="space-y-3">
                {[
                    { name: "Max Mustermann", job: "JOB-1234", rating: 5, comment: "Spot on estimate. The parts recommendation was exactly what I needed.", time: "2 hours ago", flag: false },
                    { name: "Sarah Schmidt", job: "JOB-1236", rating: 2, comment: "Too low for this area. Labor rates have gone up.", time: "5 hours ago", flag: true },
                    { name: "Tom Weber", job: "JOB-1239", rating: 4, comment: "Good diagnosis, but missed the call-out fee in the final price.", time: "1 day ago", flag: false },
                    { name: "Lisa Müller", job: "JOB-1240", rating: 5, comment: "Perfect. Saved me a lot of time explaining to the customer.", time: "1 day ago", flag: false },
                ].map((f) => (
                    <div key={f.job} className={`border rounded-xl p-4 ${f.flag ? "border-amber-200 bg-amber-50/30" : "border-gray-100"}`}>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700 text-sm">{f.name}</span>
                                <Badge color="bg-gray-100 text-gray-500">{f.job}</Badge>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="font-semibold text-sm text-gray-700">{f.rating}.0</span>
                                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mt-2">&quot;{f.comment}&quot;</p>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-400 text-xs">{f.time}</span>
                            {f.flag
                                ? <span className="text-xs text-amber-500 font-medium">⚠ Review Required</span>
                                : <button className="text-xs text-blue-500 hover:underline">View Details</button>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AIControlPanel() {
    const [activeTab, setActiveTab] = useState<Tab>("Overview");

    const tabs: Tab[] = ["Overview", "Prompt Manager", "Price Database", "Price Index", "Testing", "Feedback"];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="w-full px-6 py-8">
                {/* Header */}
                <h1 className="text-xl font-bold text-gray-800 mb-5">AI Control Panel</h1>

                {/* Nav */}
                <nav className="flex gap-1 mb-6 border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${activeTab === tab
                                ? "text-amber-500"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <div>
                    {activeTab === "Overview" && <OverviewTab />}
                    {activeTab === "Prompt Manager" && <PromptManagerTab />}
                    {activeTab === "Price Database" && <PriceDatabaseTab />}
                    {activeTab === "Price Index" && <PriceIndexTab />}
                    {activeTab === "Testing" && <TestingTab />}
                    {activeTab === "Feedback" && <FeedbackTab />}
                </div>
            </div>
        </div>
    );
}