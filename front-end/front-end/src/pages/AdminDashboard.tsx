import { useEffect, useState } from 'react';
import { getAdminDashboard } from '../services/reservationService';
import type { AdminDashboard, Reservation } from '../types';

export default function AdminDashboardPage() {
    const [dashboardData, setDashboardData] = useState<AdminDashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await getAdminDashboard();
                setDashboardData(data);
            } catch (err) {
                setError('Failed to fetch dashboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!dashboardData) {
        return <div>No dashboard data available.</div>;
    }

    const { totalReservations, totalRevenue, allReservations } = dashboardData;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Total Reservations</h2>
                    <p className="text-3xl">{totalReservations}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Total Revenue</h2>
                    <p className="text-3xl">${totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4">All Reservations</h2>
            <div className="bg-white p-4 rounded-lg shadow">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="py-2">ID</th>
                            <th className="py-2">User</th>
                            <th className="py-2">Movie</th>
                            <th className="py-2">Date</th>
                            <th className="py-2">Seats</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allReservations.map((reservation: Reservation) => (
                            <tr key={reservation.id}>
                                <td className="border px-4 py-2">{reservation.id}</td>
                                <td className="border px-4 py-2">{reservation.user.username}</td>
                                <td className="border px-4 py-2">{reservation.showTime.movieTitle}</td>
                                <td className="border px-4 py-2">{new Date(reservation.showTime.date).toLocaleString()}</td>
                                <td className="border px-4 py-2">
                                    {reservation.seats.map(seat => `${seat.seatRow}${seat.seatNumber}`).join(', ')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
