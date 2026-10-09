import React from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";
import { Card } from "../ui";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const palette = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

const ChartCard = ({ title, subtitle, children }) => (
    <Card className="p-5">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <p className="mb-4 text-sm text-slate-500">{subtitle}</p>
        {children}
    </Card>
);

const Placeholder = ({ loading }) => (
    <div className={`flex h-64 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-400 ${loading ? "animate-pulse" : ""}`}>
        {loading ? "" : "No data available"}
    </div>
);

// Charts for the dashboard overview; data comes from /api/v1/auth/dashboard.
const DashboardCharts = ({ roles, monthly, loading }) => {
    const hasRoles = roles && Object.keys(roles).length > 0;
    const hasMonthly = monthly && Object.keys(monthly).length > 0;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <ChartCard title="New registrations" subtitle="Users who signed up in the last 5 months">
                    {hasMonthly ? (
                        <div className="h-64">
                            <Bar
                                data={{
                                    labels: Object.keys(monthly),
                                    datasets: [{
                                        label: "New users",
                                        data: Object.values(monthly),
                                        backgroundColor: "#2563eb",
                                        borderRadius: 6,
                                        maxBarThickness: 40,
                                    }],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        x: { grid: { display: false } },
                                        y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: "#f1f5f9" } },
                                    },
                                }}
                            />
                        </div>
                    ) : <Placeholder loading={loading} />}
                </ChartCard>
            </div>

            <ChartCard title="Users by role" subtitle="Share of accounts per role">
                {hasRoles ? (
                    <div className="h-64">
                        <Doughnut
                            data={{
                                labels: Object.keys(roles),
                                datasets: [{
                                    data: Object.values(roles),
                                    backgroundColor: palette,
                                    borderWidth: 2,
                                    borderColor: "#fff",
                                }],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                cutout: "65%",
                                plugins: { legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8 } } },
                            }}
                        />
                    </div>
                ) : <Placeholder loading={loading} />}
            </ChartCard>
        </div>
    );
};

export default DashboardCharts;
