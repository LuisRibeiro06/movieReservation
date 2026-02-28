import { useState, useEffect } from 'react';
import type { Session, Movie, CinemaRoom } from '../types';

interface SessionModalProps {
    session: Partial<Session> | null;
    movies: Movie[];
    cinemaRooms: CinemaRoom[];
    onClose: () => void;
    onSave: (session: Omit<Session, 'id'>) => void;
}

export default function SessionModal({ session, movies, cinemaRooms, onClose, onSave }: SessionModalProps) {
    const [formData, setFormData] = useState<Omit<Session, 'id'>>({
        movieId: 0,
        cinemaRoomId: 0,
        date: '',
        price: 0,
    });

    useEffect(() => {
        if (session) {
            setFormData({
                movieId: session.movieId || 0,
                cinemaRoomId: session.cinemaRoomId || 0,
                date: session.date ? new Date(session.date).toISOString().slice(0, 16) : '',
                price: session.price || 0,
            });
        }
    }, [session]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!session) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">{session.id ? 'Edit' : 'Add'} Session</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Movie</label>
                        <select name="movieId" value={formData.movieId} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="">Select a Movie</option>
                            {movies.map(movie => (
                                <option key={movie.id} value={movie.id}>{movie.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Cinema Room</label>
                        <select name="cinemaRoomId" value={formData.cinemaRoomId} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="">Select a Room</option>
                            {cinemaRooms.map(room => (
                                <option key={room.id} value={room.id}>{room.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Date</label>
                        <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Price</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
