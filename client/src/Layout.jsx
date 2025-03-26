import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; {new Date().getFullYear()} Virtual Event Ticketing System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
