import { useEffect, useState } from 'react';
import { getAllCinemaRooms, createCinemaRoom, deleteCinemaRoom } from '../services/cinemaRoomService';
import type { CinemaRoom } from '../types';

export default function AdminCinemaRooms() {
    const [cinemaRooms, setCinemaRooms] = useState<CinemaRoom[]>([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [newRoomCapacity, setNewRoomCapacity] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCinemaRooms = async () => {
            try {
                const data = await getAllCinemaRooms();
                setCinemaRooms(data);
            } catch (err) {
                setError('Failed to fetch cinema rooms.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCinemaRooms();
    }, []);

    const handleCreate = async () => {
        if (!newRoomName || newRoomCapacity <= 0) {
            setError('Please provide a valid name and capacity.');
            return;
        }
        try {
            const newRoom = await createCinemaRoom({ name: newRoomName, capacity: newRoomCapacity });
            setCinemaRooms([...cinemaRooms, newRoom]);
            setNewRoomName('');
            setNewRoomCapacity(0);
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Cinema Rooms</h1>
            <div className="mb-4 p-4 border rounded">
                <h2 className="text-xl font-bold mb-2">Add New Room</h2>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="Room Name"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        className="p-2 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Capacity"
                        value={newRoomCapacity}
                        onChange={(e) => setNewRoomCapacity(parseInt(e.target.value, 10))}
                        className="p-2 border rounded"
                    />
                    <button
                        onClick={handleCreate}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add Room
                    </button>
                </div>
            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">Name</th>
                        <th className="py-2">Capacity</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cinemaRooms.map(room => (
                        <tr key={room.id}>
                            <td className="border px-4 py-2">{room.name}</td>
                            <td className="border px-4 py-2">{room.capacity}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleDelete(room.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
