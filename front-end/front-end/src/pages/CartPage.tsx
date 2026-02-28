// src/pages/CartPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReservationById, checkoutReservation } from '../services/reservationService';

const CartPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [reservation, setReservation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const loadCart = async () => {
            if (!id) return;
            try {
                const data = await getReservationById(Number(id));
                setReservation(data);

                if (data.expiresAt) {
                    const expiryTime = new Date(data.expiresAt).getTime();
                    const currentTime = new Date().getTime();
                    const diffInSeconds = Math.floor((expiryTime - currentTime) / 1000);
                    setTimeLeft(diffInSeconds > 0 ? diffInSeconds : 0);
                }
            } catch (error) {
                alert("Erro ao carregar o carrinho ou reserva expirada.");
                navigate('/sessions');
            } finally {
                setLoading(false);
            }
        };
        loadCart();
    }, [id, navigate]);

    // Lógica do Cronómetro (atualiza a cada segundo)
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (timeLeft <= 0) {
            alert("O tempo para pagamento expirou. Os lugares foram libertados.");
            navigate('/sessions');
            return;
        }

        setIsProcessing(true);
        try {
            await checkoutReservation(Number(id));
            alert("Payment successful!");
        } catch (error) {
            alert("Error processing payment.");
        }
        finally {
            setIsProcessing(false);
            navigate('/sessions');
        }
    };

    if (loading) return <div className="p-10 text-center">A carregar carrinho...</div>;
    if (!reservation) return <div>Carrinho vazio ou não encontrado.</div>;

    const isExpired = timeLeft <= 0 || reservation.status === 'CANCELLED';

    return (
        <div className="container mx-auto p-6 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Finish Order</h1>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h2 className="text-xl font-bold mb-4">Order Details</h2>

                    <div className="space-y-4 mb-6">
                        <div>
                            <p className="text-sm text-gray-500">Film</p>
                            <p className="font-bold">{reservation.showTime?.movie?.title || "Filme Selecionado"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Session</p>
                            <p className="font-medium">
                                {new Date(reservation.showTime?.showDate || reservation.reservationTime).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Selected places</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {reservation.seats?.map((seat: any) => (
                                    <span key={seat.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-bold">
                                        {seat.seatRow}{seat.seatNumber}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4 flex justify-between items-center">
                        <span className="text-lg">Total a Pagar:</span>
                        <span className="text-2xl font-bold text-blue-600">{reservation.totalPrice} €</span>
                    </div>
                </div>

                <div>
                    <div className={`p-4 mb-6 rounded-lg text-center font-bold text-xl border-2 ${isExpired ? 'bg-red-50 text-red-600 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                        {isExpired ? (
                            <span>Reservation expired</span>
                        ) : (
                            <div className="flex flex-col items-center">
                                <span className="text-sm uppercase tracking-wide text-yellow-600 mb-1">Time left to pay:</span>
                                <span className="text-3xl font-mono">{formatTime(timeLeft)}</span>
                            </div>
                        )}
                    </div>
                        <button onClick={handlePayment}
                            type="submit"
                            disabled={isExpired || isProcessing}
                            className={`w-full mt-6 py-3 rounded-lg font-bold text-white transition-all
                                ${isExpired
                                ? 'bg-gray-400 cursor-not-allowed'
                                : isProcessing
                                    ? 'bg-blue-400 cursor-wait'
                                    : 'bg-green-600 hover:bg-green-700 shadow-lg'
                            }`}
                        >
                            {isProcessing ? 'Processing...' : 'Pay and Checkout'}
                        </button>
                </div>
                </div>
            </div>
    );
};

export default CartPage;