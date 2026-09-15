import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, Calendar, TrendingUp, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/stats');
                setStats(res.data.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                fill: true,
                label: 'Submissions',
                data: [65, 59, 80, 81, 56, 55, 40], // Dummy data for visual
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f3f4f6' }
            },
            x: {
                grid: { display: false }
            }
        }
    };

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem' }}>Overview</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <StatCard title="Total Submissions" value={stats?.total || 0} icon={<Users />} color="#4F46E5" />
                <StatCard title="Today" value={stats?.today || 0} icon={<Activity />} color="#10B981" />
                <StatCard title="This Week" value={stats?.week || 0} icon={<TrendingUp />} color="#F59E0B" />
                <StatCard title="This Month" value={stats?.month || 0} icon={<Calendar />} color="#EC4899" />
            </div>

            <div className="card" style={{ height: '400px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Submission Trends</h3>
                <div style={{ height: '300px' }}>
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="card flex items-center gap-4">
        <div style={{ 
            width: '48px', height: '48px', borderRadius: '12px', 
            background: `${color}15`, color: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
            {icon}
        </div>
        <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{title}</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {value.toLocaleString()}
            </h3>
        </div>
    </div>
);

export default Dashboard;
