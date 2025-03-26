import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const eventId = window.location.pathname.split('/')[2];
                const response = await axios.get(`/api/analytics/event/${eventId}`, {
                    withCredentials: true
                });
                setAnalytics(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch analytics');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
    if (!analytics) return <div>No analytics data available</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Event Analytics</h1>

            {/* Ticket Sales Overview */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">Ticket Sales Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold">Total Tickets</h3>
                        <p className="text-2xl">{analytics.ticketAnalytics.totalTickets}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold">Sold Tickets</h3>
                        <p className="text-2xl">{analytics.ticketAnalytics.soldTickets}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold">Total Revenue</h3>
                        <p className="text-2xl">${analytics.ticketAnalytics.totalRevenue}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold">Avg. Ticket Price</h3>
                        <p className="text-2xl">${analytics.ticketAnalytics.averageTicketPrice}</p>
                    </div>
                </div>
            </div>

            {/* Video Performance */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">Video Performance</h2>
                <div className="w-full">
                    <LineChart width={800} height={300} data={analytics.videoPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="views" stroke="#8884d8" />
                    </LineChart>
                </div>
            </div>

            {/* Engagement Metrics */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Engagement Metrics</h2>
                <div className="w-full">
                    <BarChart width={800} height={300} data={analytics.engagementMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
};

export default Analytics; 