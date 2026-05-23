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
        movieTitle: '',
        cinemaRoomId: 0,
        roomName: '',
        date: '',
        price: 0,
    });

    useEffect(() => {
        if (session) {
            const selectedMovie = movies.find(m => m.id === session.movieId);
            const selectedRoom = cinemaRooms.find(r => r.id === session.cinemaRoomId);
            
            setFormData({
                movieId: session.movieId || 0,
                movieTitle: selectedMovie?.title || session.movieTitle || '',
                cinemaRoomId: session.cinemaRoomId || 0,
                roomName: selectedRoom?.name || session.roomName || '',
                date: session.date ? new Date(session.date).toISOString().slice(0, 16) : '',
                price: session.price || 0,
            });
        }
    }, [session, movies, cinemaRooms]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numValue = name === 'movieId' || name === 'cinemaRoomId' || name === 'price' ? Number(value) : value;
        
        setFormData(prev => {
            const updated = { ...prev, [name]: numValue };
            
            if (name === 'movieId') {
                const selectedMovie = movies.find(m => m.id === Number(value));
                updated.movieTitle = selectedMovie?.title || '';
            } else if (name === 'cinemaRoomId') {
                const selectedRoom = cinemaRooms.find(r => r.id === Number(value));
                updated.roomName = selectedRoom?.name || '';
            }
            
            return updated;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!session) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-[var(--color-card)] border border-white/10 rounded-[18px] p-8 w-full max-w-md">
                <h2 className="font-[var(--font-display)] text-[1.8rem] tracking-widest mb-6 text-center text-white">{session.id ? 'Edit' : 'Add'} Session</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-[0.76rem] font-semibold tracking-[0.08em] uppercase text-[var(--color-t2)] mb-1.5">Movie</label>
                        <select name="movieId" value={formData.movieId} onChange={handleChange} className="w-full px-4 py-3 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-t1)] outline-none focus:border-[var(--color-accent)]">
                            <option value="">Select a Movie</option>
                            {movies.map(movie => (
                                <option key={movie.id} value={movie.id}>{movie.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[0.76rem] font-semibold tracking-[0.08em] uppercase text-[var(--color-t2)] mb-1.5">Cinema Room</label>
                        <select name="cinemaRoomId" value={formData.cinemaRoomId} onChange={handleChange} className="w-full px-4 py-3 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-t1)] outline-none focus:border-[var(--color-accent)]">
                            <option value="">Select a Room</option>
                            {cinemaRooms.map(room => (
                                <option key={room.id} value={room.id}>{room.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[0.76rem] font-semibold tracking-[0.08em] uppercase text-[var(--color-t2)] mb-1.5">Date</label>
                        <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-3 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-t1)] outline-none focus:border-[var(--color-accent)]" />
                    </div>
                    <div>
                        <label className="block text-[0.76rem] font-semibold tracking-[0.08em] uppercase text-[var(--color-t2)] mb-1.5">Price</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-t1)] outline-none focus:border-[var(--color-accent)]" />
                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg border border-white/10 text-[var(--color-t2)] hover:bg-white/5">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-[var(--color-accent)] text-[#0a0810] font-semibold hover:bg-[#f0b030]">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
