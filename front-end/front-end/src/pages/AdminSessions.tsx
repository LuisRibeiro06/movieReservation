import { useEffect, useState } from 'react';
import { getSessions, createSession, updateSession, deleteSession } from '../services/sessionService';
import { getMovies } from '../services/movieService';
import { getAllCinemaRooms } from '../services/cinemaRoomService';
import type { Session, Movie, CinemaRoom } from '../types';
import SessionModal from '../components/SessionModal';

export default function AdminSessions() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [cinemaRooms, setCinemaRooms] = useState<CinemaRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Partial<Session> | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sessionsData, moviesData, cinemaRoomsData] = await Promise.all([
                    getSessions(),
                    getMovies(),
                    getAllCinemaRooms(),
                ]);
                setSessions(sessionsData);
                setMovies(moviesData);
                setCinemaRooms(cinemaRoomsData);
            } catch (err) {
                setError('Failed to fetch data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpenModal = (session: Partial<Session> | null = null) => {
        setSelectedSession(session);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedSession(null);
        setIsModalOpen(false);
    };

    const handleSave = async (sessionData: Omit<Session, 'id'>) => {
        try {
            if (selectedSession && selectedSession.id) {
                const updatedSession = await updateSession(selectedSession.id, sessionData);
                setSessions(sessions.map(s => s.id === updatedSession.id ? updatedSession : s));
            } else {
                const newSession = await createSession(sessionData);
                setSessions([...sessions, newSession]);
            }
            handleCloseModal();
        } catch (err) {
            setError('Failed to save session.');
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this session?')) {
            try {
                await deleteSession(id);
                setSessions(sessions.filter(session => session.id !== id));
            } catch (err) {
                setError('Failed to delete session.');
                console.error(err);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const getMovieTitle = (movieId: number) => movies.find(movie => movie.id === movieId)?.title || 'Unknown Movie';
    const getCinemaRoomName = (roomId: number) => cinemaRooms.find(room => room.id === roomId)?.name || 'Unknown Room';

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Sessions</h1>
            <div className="mb-4">
                <button
                    onClick={() => handleOpenModal({})}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add New Session
                </button>
            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">Movie</th>
                        <th className="py-2">Room</th>
                        <th className="py-2">Date</th>
                        <th className="py-2">Price</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map(session => (
                        <tr key={session.id}>
                            <td className="border px-4 py-2">{getMovieTitle(session.movieId)}</td>
                            <td className="border px-4 py-2">{getCinemaRoomName(session.cinemaRoomId)}</td>
                            <td className="border px-4 py-2">{new Date(session.date).toLocaleString()}</td>
                            <td className="border px-4 py-2">${session.price.toFixed(2)}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleOpenModal(session)}
                                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(session.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <SessionModal
                    session={selectedSession}
                    movies={movies}
                    cinemaRooms={cinemaRooms}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
