import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReservationById, checkoutReservation } from '../services/reservationService';

const CartPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalSeconds, setTotalSeconds] = useState(1);

    useEffect(() => {
        if (!id) return;
        getReservationById(Number(id))
            .then(data => {
                setReservation(data);
                if (data.expiresAt) {
                    const diff = Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000);
                    const total = Math.floor((new Date(data.expiresAt).getTime() - new Date(data.reservationTime).getTime()) / 1000);
                    setTimeLeft(diff > 0 ? diff : 0);
                    setTotalSeconds(total > 0 ? total : 1);
                }
            })
            .catch(() => navigate('/sessions'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const t = setInterval(() => setTimeLeft(p => p <= 1 ? (clearInterval(t), 0) : p - 1), 1000);
        return () => clearInterval(t);
    }, [timeLeft]);

    const fmt = (s: number) =>
        `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const handlePayment = async () => {
        if (timeLeft <= 0) { navigate('/sessions'); return; }
        setIsProcessing(true);
        try { await checkoutReservation(Number(id)); }
        catch {/* handle */}
        finally { setIsProcessing(false); navigate('/sessions'); }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center text-[var(--color-t3)]">Loading cart…</div>
    );
    if (!reservation) return null;

    const isExpired = timeLeft <= 0 || reservation.status === 'CANCELLED';
    const pct = Math.max(0, Math.min(100, (timeLeft / totalSeconds) * 100));
    const barColor = pct > 40 ? 'var(--color-accent)' : '#f87171';

    return (
        <div className="max-w-2xl mx-auto px-8 pt-12 pb-20">
            {/* Header */}
            <div className="fade-up mb-10">
                <p className="text-[0.78rem] tracking-[0.2em] uppercase text-[var(--color-accent)] mb-2">Checkout</p>
                <h1 className="font-[var(--font-display)] text-[clamp(2rem,5vw,3.5rem)] tracking-wide leading-none">
                    Complete order
                </h1>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-5 items-start flex-wrap">
                {/* Order summary */}
                <div className="fade-up-1 bg-[var(--color-card)] border border-white/7 rounded-[18px] p-7">
                    <h2 className="text-[0.72rem] font-semibold tracking-[0.15em] uppercase text-[var(--color-t3)] mb-5">
                        Order details
                    </h2>

                    <p className="font-[var(--font-display)] text-[1.8rem] tracking-wide leading-none mb-1">
                        {reservation.showTime?.movie?.title || 'Film'}
                    </p>
                    <p className="text-[0.84rem] text-[var(--color-t2)] mb-6">
                        {new Date(reservation.showTime?.showDate || reservation.reservationTime)
                            .toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>

                    <p className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-[var(--color-t3)] mb-2">
                        Selected seats
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                        {reservation.seats?.map((seat: any) => (
                            <span key={seat.id} className="px-2.5 py-1 rounded-full text-[0.68rem] font-semibold tracking-wide uppercase bg-[rgba(232,160,32,0.12)] text-[var(--color-accent)] border border-[rgba(232,160,32,0.3)]">
                                {seat.seatRow}{seat.seatNumber}
                            </span>
                        ))}
                    </div>

                    <hr className="border-none border-t border-white/10 mb-5" />

                    <div className="flex justify-between items-baseline">
                        <span className="text-[0.84rem] text-[var(--color-t2)]">Total</span>
                        <span className="font-[var(--font-display)] text-[2rem] tracking-wide text-[var(--color-accent)]">
                            €{reservation.totalPrice}
                        </span>
                    </div>
                </div>

                {/* Timer + pay */}
                <div className="fade-up-2 w-48 flex flex-col gap-4">
                    <div className={`bg-[var(--color-card)] border rounded-xl p-5 text-center ${isExpired ? 'border-red-500/20' : 'border-[rgba(232,160,32,0.2)]'}`}>
                        {isExpired ? (
                            <p className="text-[0.78rem] font-semibold text-red-400 m-0">Reservation expired</p>
                        ) : (
                            <>
                                <p className="text-[0.62rem] tracking-[0.15em] uppercase text-[var(--color-t3)] mb-1">Time remaining</p>
                                <p className="font-[var(--font-display)] text-[2.2rem] tracking-widest text-[var(--color-accent)] leading-none mb-3">
                                    {fmt(timeLeft)}
                                </p>
                                {/* Progress bar */}
                                <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-[width] duration-1000 ease-linear"
                                        style={{ width: `${pct}%`, background: barColor, transition: 'width 1s linear, background 0.5s' }}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={isExpired || isProcessing}
                        className="w-full py-3.5 rounded-lg font-semibold text-[0.9rem] transition-all duration-200 border-none cursor-pointer bg-[var(--color-accent)] text-[#0a0810] hover:bg-[#f0b030] hover:shadow-[0_0_24px_rgba(232,160,32,0.4)] disabled:bg-[var(--color-t3)] disabled:text-[var(--color-t2)] disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Processing…' : isExpired ? 'Expired' : 'Pay now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
