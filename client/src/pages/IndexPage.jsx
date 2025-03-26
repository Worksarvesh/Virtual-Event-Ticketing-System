/* eslint-disable react/jsx-key */
import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { BiLike } from "react-icons/bi";

export default function IndexPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("/api/events", { withCredentials: true });
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
                setError("Failed to load events. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleLike = (eventId) => {
        // Implement like functionality
        console.log("Liked event:", eventId);
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                            <p className="text-gray-600 mb-4">{event.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">
                                    {new Date(event.date).toLocaleDateString()}
                                </span>
                                <button
                                    onClick={() => handleLike(event._id)}
                                    className="text-gray-500 hover:text-red-500"
                                >
                                    <BiLike className="w-6 h-6" />
                                </button>
                            </div>
                            <Link
                                to={`/event/${event._id}`}
                                className="mt-4 inline-flex items-center text-blue-500 hover:text-blue-700"
                            >
                                View Details
                                <BsArrowRightShort className="w-5 h-5 ml-1" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
  