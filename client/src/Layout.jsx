import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './pages/Footer'
import Header from './pages/Header'

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
