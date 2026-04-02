import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../services/userService';
import { getReservationsByUser } from '../services/reservationService';
import type { User, Reservation } from '../types';

const UserProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userProfile = await getUserProfile();
                setUser(userProfile);
                const userReservations = await getReservationsByUser();
                setReservations(userReservations);
            } catch (err) {
                setError('Failed to fetch user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div className="min-h-[80vh] flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-[80vh] flex items-center justify-center text-red-500">{error}</div>;
    }

    if (!user) {
        return <div className="min-h-[80vh] flex items-center justify-center">User not found.</div>;
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-8 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none"
                 style={{ background: 'radial-gradient(ellipse, rgba(232,160,32,0.05) 0%, transparent 70%)' }} />

            <div className="fade-up w-full max-w-[600px] bg-[var(--color-card)] border border-white/7 rounded-[18px] p-10">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-[rgba(232,160,32,0.1)] border border-[rgba(232,160,32,0.25)] rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                        👤
                    </div>
                    <h1 className="font-[var(--font-display)] text-[2rem] tracking-widest mb-1">USER PROFILE</h1>
                    <p className="text-[0.8rem] text-[var(--color-t3)] m-0">Your personal information and reservations</p>
                </div>

                <div className="bg-[var(--color-surface)] border border-white/10 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-[var(--color-t1)]">User Information</h2>
                    <p className="text-[var(--color-t2)]"><strong>Username:</strong> {user.username}</p>
                    <p className="text-[var(--color-t2)]"><strong>Email:</strong> {user.email}</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4 text-[var(--color-t1)]">My Reservations</h2>
                    <div className="bg-[var(--color-surface)] border border-white/10 rounded-lg p-6">
                        {reservations.length > 0 ? (
                            <ul className="space-y-4">
                                {reservations.map((reservation) => (
                                    <li key={reservation.id} className="border-b border-white/10 pb-4 last:border-b-0">
                                        <p className="text-[var(--color-t2)]"><strong>Movie:</strong> {reservation.showTime.movieTitle}</p>
                                        <p className="text-[var(--color-t2)]"><strong>Date:</strong> {new Date(reservation.showTime.date).toLocaleString()}</p>
                                        <p className="text-[var(--color-t2)]"><strong>Total Price:</strong> ${reservation.totalPrice.toFixed(2)}</p>
                                        <p className="text-[var(--color-t2)]"><strong>Status:</strong> {reservation.status}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-[var(--color-t3)]">You have no reservations.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
