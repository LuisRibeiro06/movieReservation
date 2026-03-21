import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSessionById } from '../services/sessionService';
import { useAuth } from '../hooks/useAuth';
import type { Session, SeatAvailability } from '../types';
import { getSeatsForShowTime } from '../services/seatService';
import { createReservation } from '../services/reservationService';

const SessionPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [session, setSession] = useState<Session | null>(null);
    const [seats, setSeats] = useState<SeatAvailability[]>([]);
    const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [reserving, setReserving] = useState(false);

    useEffect(() => {
        if (!id) return;
        Promise.all([getSessionById(Number(id)), getSeatsForShowTime(Number(id))])
            .then(([s, seats]) => { setSession(s); setSeats(seats); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const toggleSeat = (seatId: number) => {
        const seat = seats.find(s => s.id === seatId);
        if (!seat?.isAvailable) return;
        setSelectedSeatIds(prev => prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]);
    };

    const handleReservation = async () => {
        if (!isAuthenticated) return navigate('/login');
        setReserving(true);
        try {
            const r = await createReservation({ showTimeId: Number(id), seatIds: selectedSeatIds });
            navigate(`/cart/${r.id}`);
        } catch {
            const updated = await getSeatsForShowTime(Number(id));
            setSeats(updated);
            setSelectedSeatIds([]);
        } finally {
            setReserving(false);
        }
    };

    const getSeatsByRow = () => {
        const rows: Record<string, SeatAvailability[]> = {};
        seats.forEach(s => { if (!rows[s.seatRow]) rows[s.seatRow] = []; rows[s.seatRow].push(s); });
        Object.keys(rows).forEach(k => rows[k].sort((a, b) => a.seatNumber - b.seatNumber));
        return rows;
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center text-[var(--color-t3)]">Loading session…</div>
    );
    if (!session) return (
        <div className="min-h-[60vh] flex items-center justify-center text-red-400">Session not found.</div>
    );

    const seatsByRow = getSeatsByRow();
    const total = (selectedSeatIds.length * session.price).toFixed(2);

    return (
        <div className="max-w-4xl mx-auto px-8 pt-12 pb-20">
            {/* Header */}
            <div className="fade-up mb-10">
                <div className="flex gap-2 flex-wrap mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[0.68rem] font-semibold tracking-wide uppercase bg-[rgba(232,160,32,0.12)] text-[var(--color-accent)] border border-[rgba(232,160,32,0.3)]">
                        {new Date(session.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[0.68rem] font-semibold tracking-wide uppercase bg-[var(--color-surface)] text-[var(--color-t2)] border border-white/10">
                        {session.roomName}
                    </span>
                </div>
                <h1 className="font-[var(--font-display)] text-[clamp(1.8rem,4vw,3rem)] tracking-wide leading-none mb-2">
                    {session.movieTitle}
                </h1>
                <p className="text-[var(--color-t2)] text-[0.88rem] m-0">
                    {new Date(session.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    {' · '}€{session.price.toFixed(2)} per seat
                </p>
            </div>

            <div className="flex gap-6 flex-wrap items-start">
                {/* Seat map */}
                <div className="fade-up-1 flex-1 min-w-[280px] bg-[var(--color-card)] border border-white/7 rounded-[18px] p-8 overflow-x-auto">
                    {/* Screen bar */}
                    <div className="relative w-[65%] max-w-xs mx-auto mb-10 h-1.5 rounded-full"
                        style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }}>
                        <p className="absolute top-3 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.2em] uppercase text-[var(--color-t3)] whitespace-nowrap">
                            Screen
                        </p>
                    </div>

                    {/* Rows */}
                    <div className="flex flex-col gap-2 items-center">
                        {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                            <div key={row} className="flex items-center gap-1.5">
                                <span className="w-5 text-right text-[0.68rem] font-bold text-[var(--color-t3)]">{row}</span>
                                <div className="flex gap-1.5 flex-wrap">
                                    {rowSeats.map(seat => {
                                        const isSelected = selectedSeatIds.includes(seat.id);
                                        const cls = !seat.isAvailable ? 'seat-occupied' : isSelected ? 'seat-selected' : 'seat-available';
                                        return (
                                            <button
                                                key={seat.id}
                                                disabled={!seat.isAvailable}
                                                onClick={() => toggleSeat(seat.id)}
                                                className={`seat ${cls}`}
                                                title={`${seat.seatRow}${seat.seatNumber}`}
                                            >
                                                {seat.seatNumber}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex gap-6 justify-center mt-8 flex-wrap">
                        {[
                            { label: 'Available', cls: 'seat seat-available' },
                            { label: 'Selected',  cls: 'seat seat-selected'  },
                            { label: 'Taken',     cls: 'seat seat-occupied'  },
                        ].map(({ label, cls }) => (
                            <div key={label} className="flex items-center gap-1.5 text-[0.7rem] text-[var(--color-t3)]">
                                <div className={`${cls} w-4 h-4 text-[0px] pointer-events-none`} />
                                {label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary panel */}
                <div className="fade-up-2 w-56 bg-[var(--color-card)] border border-white/7 rounded-[18px] p-6 sticky top-20 shrink-0">
                    <h3 className="font-[var(--font-display)] text-[1.05rem] tracking-widest mb-5 m-0">SUMMARY</h3>

                    <div className="flex justify-between text-[0.84rem] text-[var(--color-t2)] mb-2">
                        <span>Seats</span>
                        <span className="font-semibold text-[var(--color-t1)]">{selectedSeatIds.length}</span>
                    </div>

                    {selectedSeatIds.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                            {selectedSeatIds.map(sid => {
                                const s = seats.find(x => x.id === sid);
                                return s ? (
                                    <span key={sid} className="px-2 py-0.5 rounded-full text-[0.65rem] font-semibold tracking-wide uppercase bg-[rgba(232,160,32,0.12)] text-[var(--color-accent)] border border-[rgba(232,160,32,0.3)]">
                                        {s.seatRow}{s.seatNumber}
                                    </span>
                                ) : null;
                            })}
                        </div>
                    )}

                    <hr className="border-none border-t border-white/10 my-4" />

                    <div className="flex justify-between items-baseline mb-6">
                        <span className="text-[0.8rem] text-[var(--color-t2)]">Total</span>
                        <span className="font-[var(--font-display)] text-[1.6rem] tracking-wide text-[var(--color-accent)]">
                            €{total}
                        </span>
                    </div>

                    {isAuthenticated ? (
                        <button
                            onClick={handleReservation}
                            disabled={selectedSeatIds.length === 0 || reserving}
                            className="w-full py-3 rounded-lg bg-[var(--color-accent)] text-[#0a0810] font-semibold text-[0.88rem] hover:bg-[#f0b030] hover:shadow-[0_0_20px_rgba(232,160,32,0.4)] transition-all duration-200 disabled:bg-[var(--color-t3)] disabled:text-[var(--color-t2)] disabled:shadow-none disabled:cursor-not-allowed cursor-pointer border-none"
                        >
                            {reserving ? 'Reserving…' : 'Go to checkout'}
                        </button>
                    ) : (
                        <Link to="/login" className="block w-full py-3 rounded-lg border border-white/10 text-[var(--color-t2)] text-[0.88rem] font-medium text-center no-underline hover:border-[rgba(232,160,32,0.3)] hover:text-[var(--color-t1)] transition-all duration-200">
                            Sign in to book
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SessionPage;
