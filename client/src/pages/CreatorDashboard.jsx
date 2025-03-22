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

const CreatorDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get('/api/analytics/creator', {
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
            <h1 className="text-3xl font-bold mb-8">Creator Dashboard</h1>

            {/* Channel Overview */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">Channel Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold">Total Views</h3>
                        <p className="text-2xl">{analytics.channelAnalytics.rows[0]?.views || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold">Watch Time</h3>
                        <p className="text-2xl">{Math.round(analytics.channelAnalytics.rows[0]?.estimatedMinutesWatched / 60)} hours</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold">Subscribers Gained</h3>
                        <p className="text-2xl">{analytics.channelAnalytics.rows[0]?.subscribersGained || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold">Total Engagement</h3>
                        <p className="text-2xl">{analytics.channelAnalytics.rows[0]?.likes + analytics.channelAnalytics.rows[0]?.comments || 0}</p>
                    </div>
                </div>
            </div>

            {/* Event Statistics */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">Event Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold">Total Events</h3>
                        <p className="text-2xl">{analytics.eventStats.totalEvents}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold">Total Revenue</h3>
                        <p className="text-2xl">${analytics.eventStats.totalRevenue}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold">Tickets Sold</h3>
                        <p className="text-2xl">{analytics.eventStats.totalTicketsSold}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold">Avg. Attendance</h3>
                        <p className="text-2xl">{Math.round(analytics.eventStats.averageAttendance)}</p>
                    </div>
                </div>
            </div>

            {/* Revenue Trends */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Revenue Trends</h2>
                <div className="w-full">
                    <LineChart width={800} height={300} data={analytics.eventStats.revenueTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                    </LineChart>
                </div>
            </div>
        </div>
    );
};

export default CreatorDashboard; 