import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../UserContext';

const Navigation = () => {
    const { user } = useUser();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold text-gray-800">
                                EventoEMS
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                    isActive('/')
                                        ? 'border-indigo-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/create-event"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                    isActive('/create-event')
                                        ? 'border-indigo-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Create Event
                            </Link>
                            {user?.role === 'creator' && (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                            isActive('/dashboard')
                                                ? 'border-indigo-500 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                    >
                                        Dashboard
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700">{user.name}</span>
                                <Link
                                    to="/useraccount"
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Account
                                </Link>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 