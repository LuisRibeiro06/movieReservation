import { useEffect, useState } from 'react';
import { getAdminDashboard } from '../services/reservationService';
import type { AdminDashboard, Reservation } from '../types';
import ErrorState from "../components/ErrorState.tsx";

export default function AdminDashboardPage() {
    const [dashboardData, setDashboardData] = useState<AdminDashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminDashboard();
            setDashboardData(data);
        } catch (err) {
            setError('Failed to fetch dashboard data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="min-h-[80vh] flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        return <ErrorState message={error} onRetry={fetchDashboardData} />;
    }

    if (!dashboardData) {
        return <div className="min-h-[80vh] flex items-center justify-center">No dashboard data available.</div>;
    }

    const { totalReservations, totalRevenue, allReservations } = dashboardData;

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-8 relative text-white">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none"
                 style={{ background: 'radial-gradient(ellipse, rgba(232,160,32,0.05) 0%, transparent 70%)' }} />

            <div className="fade-up w-full max-w-4xl bg-[var(--color-card)] border border-white/7 rounded-[18px] p-10 my-8">
                <h1 className="font-[var(--font-display)] text-[2rem] tracking-widest mb-6 text-center">Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[var(--color-surface)] border border-white/10 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-[var(--color-t2)]">Total Reservations</h2>
                        <p className="text-3xl font-bold text-[var(--color-t1)]">{totalReservations}</p>
                    </div>
                    <div className="bg-[var(--color-surface)] border border-white/10 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-[var(--color-t2)]">Total Revenue</h2>
                        <p className="text-3xl font-bold text-[var(--color-t1)]">${totalRevenue.toFixed(2)}</p>
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-4 text-center">All Reservations</h2>
                <div className="bg-[var(--color-surface)] border border-white/10 rounded-lg p-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="p-4 text-[var(--color-t2)]">ID</th>
                                    <th className="p-4 text-[var(--color-t2)]">User</th>
                                    <th className="p-4 text-[var(--color-t2)]">Movie</th>
                                    <th className="p-4 text-[var(--color-t2)]">Date</th>
                                    <th className="p-4 text-[var(--color-t2)]">Seats</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allReservations.map((reservation: Reservation) => (
                                    <tr key={reservation.id} className="border-b border-white/10 last:border-b-0">
                                        <td className="p-4">{reservation.id}</td>
                                        <td className="p-4">{reservation.user.username}</td>
                                        <td className="p-4">{reservation.showTime.movieTitle}</td>
                                        <td className="p-4">{new Date(reservation.showTime.date).toLocaleString()}</td>
                                        <td className="p-4">
                                            {reservation.seats.map(seat => `${seat.seatRow}${seat.seatNumber}`).join(', ')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
