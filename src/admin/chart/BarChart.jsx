import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from "chart.js";
import AxiosWithAuth from "../../contexts/AxiosWithAuth";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

const DashboardCharts = () => {
    const [rolesData, setRolesData] = useState(null);
    const [monthlyData, setMonthlyData] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await AxiosWithAuth().get("/api/v1/auth/dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = response.data;
                console.log("API response:", data);
                if (data.roles && data.monthlyRegistrations) {
                    setRolesData(data.roles);
                    setMonthlyData(data.monthlyRegistrations);
                } else {
                    console.error("Failed to fetch dashboard data");
                }
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };

        fetchDashboard();
    }, []);

    if (loading) return <p>Loading charts...</p>;

    if (!rolesData || !monthlyData) return <p>No data available</p>;

    const pieData = {
        labels: Object.keys(rolesData),
        datasets: [
            {
                label: "User Roles",
                data: Object.values(rolesData),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
            },
        ],
    };

    const barData = {
        labels: Object.keys(monthlyData),
        datasets: [
            {
                label: "New Users Per Month",
                data: Object.values(monthlyData),
                backgroundColor: "#36A2EB",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: {
                display: true,
                text: "User Registration Stats",
            },
        },
    };

    return (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">User Roles Distribution</h2>
                <Pie data={pieData} />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Monthly User Registrations</h2>
                <Bar data={barData} options={options} />
            </div>
        </div>
    );
};

export default DashboardCharts;
