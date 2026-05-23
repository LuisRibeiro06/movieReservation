import { useEffect, useState } from 'react';
import { getSessions, createSession, updateSession, deleteSession } from '../services/sessionService';
import { getMovies } from '../services/movieService';
import { getAllCinemaRooms } from '../services/cinemaRoomService';
import type { Session, Movie, CinemaRoom } from '../types';
import SessionModal from '../components/SessionModal';
import ErrorState from "../components/ErrorState.tsx";

export default function AdminSessions() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [cinemaRooms, setCinemaRooms] = useState<CinemaRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Partial<Session> | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
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

    useEffect(() => {
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
        return <div className="min-h-[80vh] flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        return <ErrorState message={error} onRetry={fetchData} />;
    }

    const getMovieTitle = (movieId: number) => movies.find(movie => movie.id === movieId)?.title || 'Unknown Movie';
    const getCinemaRoomName = (roomId: number) => cinemaRooms.find(room => room.id === roomId)?.name || 'Unknown Room';

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-8 relative text-white">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none"
                 style={{ background: 'radial-gradient(ellipse, rgba(232,160,32,0.05) 0%, transparent 70%)' }} />

            <div className="fade-up w-full max-w-6xl bg-[var(--color-card)] border border-white/7 rounded-[18px] p-10 my-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="font-[var(--font-display)] text-[2rem] tracking-widest">Manage Sessions</h1>
                    <button
                        onClick={() => handleOpenModal({})}
                        className="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-[#0a0810] font-semibold hover:bg-[#f0b030]"
                    >
                        Add New Session
                    </button>
                </div>

                <div className="bg-[var(--color-surface)] border border-white/10 rounded-lg p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="p-4 text-[var(--color-t2)]">Movie</th>
                                    <th className="p-4 text-[var(--color-t2)]">Room</th>
                                    <th className="p-4 text-[var(--color-t2)]">Date</th>
                                    <th className="p-4 text-[var(--color-t2)]">Price</th>
                                    <th className="p-4 text-right text-[var(--color-t2)]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-[var(--color-t1)]">
                                {sessions.map(session => (
                                    <tr key={session.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                                        <td className="p-4">{getMovieTitle(session.movieId)}</td>
                                        <td className="p-4">{getCinemaRoomName(session.cinemaRoomId)}</td>
                                        <td className="p-4">{new Date(session.date).toLocaleString()}</td>
                                        <td className="p-4">${session.price.toFixed(2)}</td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(session)}
                                                className="text-green-500 hover:text-green-700 bg-green-50/10 px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(session.id)}
                                                className="text-red-500 hover:text-red-700 bg-red-50/10 px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

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
