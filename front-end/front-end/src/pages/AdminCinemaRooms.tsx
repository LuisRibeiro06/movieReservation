import { useEffect, useState } from 'react';
import { getAllCinemaRooms, createCinemaRoom, deleteCinemaRoom } from '../services/cinemaRoomService';
import type { CinemaRoom } from '../types';
import ErrorState from "../components/ErrorState.tsx";

export default function AdminCinemaRooms() {
    const [cinemaRooms, setCinemaRooms] = useState<CinemaRoom[]>([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [newRoomSeatsPerRow, setNewRoomSeatsPerRow] = useState(0);
    const [newRoomRows, setNewRoomRows] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const   fetchCinemaRooms = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllCinemaRooms();
            setCinemaRooms(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to fetch cinema rooms.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCinemaRooms();
    }, []);

    const handleCreate = async () => {
        if (!newRoomName || newRoomSeatsPerRow <= 0 || newRoomRows <= 0) {
            setError('Please provide a valid name and capacity.');
            return;
        }
        try {
            await createCinemaRoom({ name: newRoomName, numberOfRows: newRoomRows, seatsPerRow: newRoomSeatsPerRow });
            setNewRoomName('');
            setNewRoomSeatsPerRow(0);
            setNewRoomRows(0);
            await fetchCinemaRooms(); // Recarrega a lista
        } catch (err) {
            setError('Failed to create cinema room.');
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this cinema room?')) {
            try {
                await deleteCinemaRoom(id);
                setCinemaRooms(cinemaRooms.filter(room => room.id !== id));
            } catch (err) {
                setError('Failed to delete cinema room.');
                console.error(err);
            }
        }
    };

    if (loading) {
        return <div className="min-h-[80vh] flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        return <ErrorState message={error} onRetry={fetchCinemaRooms} />;
    }

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-8 relative text-white">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none"
                 style={{ background: 'radial-gradient(ellipse, rgba(232,160,32,0.05) 0%, transparent 70%)' }} />

            <div className="fade-up w-full max-w-4xl bg-[var(--color-card)] border border-white/7 rounded-[18px] p-10 my-8">
                <h1 className="font-[var(--font-display)] text-[2rem] tracking-widest mb-6 text-center">Manage Cinema Rooms</h1>

                <div className="bg-[var(--color-surface)] border border-white/10 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-center">Add New Room</h2>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Room Name"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            className="flex-1 px-4 py-3 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-t1)] placeholder:text-[var(--color-t3)] outline-none focus:border-[var(--color-accent)]"
                        />
                        <input
                            type="number"
                            placeholder="Number of Rows"
                            value={newRoomRows}
                            onChange={(e) => setNewRoomRows(parseInt(e.target.value, 10))}
                            className="flex-1 px-4 py-3 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-t1)] placeholder:text-[var(--color-t3)] outline-none focus:border-[var(--color-accent)]"
                        />
                        <input
                            type="number"
                            placeholder="Seats Per Row"
                            value={newRoomSeatsPerRow}
                            onChange={(e) => setNewRoomSeatsPerRow(parseInt(e.target.value, 10))}
                            className="flex-1 px-4 py-3 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-t1)] placeholder:text-[var(--color-t3)] outline-none focus:border-[var(--color-accent)]"
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={handleCreate}
                            className="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-[#0a0810] font-semibold hover:bg-[#f0b030]"
                        >
                            Add Room
                        </button>
                    </div>
                </div>

                <div className="bg-[var(--color-surface)] border border-white/10 rounded-lg p-6">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="p-4 text-[var(--color-t2)]">Name</th>
                                <th className="p-4 text-[var(--color-t2)]">Number of Rows</th>
                                <th className="p-4 text-[var(--color-t2)]">Seats per Row</th>
                                <th className="p-4 text-right text-[var(--color-t2)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cinemaRooms.map(room => (
                                <tr key={room.id} className="border-b border-white/10 last:border-b-0">
                                    <td className="p-4">{room.name}</td>
                                    <td className="p-4">{room.numberOfRows}</td>
                                    <td className="p-4">{room.seatsPerRow}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(room.id)}
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
    );
}