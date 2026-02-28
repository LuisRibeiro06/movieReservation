import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {getSessionById} from "../services/sessionService.ts";
import { useAuth } from '../hooks/useAuth';
import type { Session, SeatAvailability } from '../types';
import {getSeatsForShowTime} from "../services/seatService.ts";
import {createReservation} from "../services/reservationService.ts";

const SessionPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [session, setSession] = useState<Session | null>(null);
    const [seats, setSeats] = useState<SeatAvailability[]>([]);
    const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const [sessionData, seatsData] = await Promise.all([
                    getSessionById(Number(id)),
                    getSeatsForShowTime(Number(id)) //
                ]);
                setSession(sessionData);
                setSeats(seatsData);
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const toggleSeat = (seatId: number) => {
        const seat = seats.find(s => s.id === seatId);
        if (!seat || !seat.isAvailable) return;

        setSelectedSeatIds(prev =>
            prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId]
        );
    };

    const handleReservation = async () => {
        if (!isAuthenticated) return navigate('/login');

        try {
            await createReservation({
                showTimeId: Number(id),
                seatIds: selectedSeatIds
            });
            alert("Reservation made successfully!");
            navigate('/sessions');
        } catch (error) {
            alert("Error making reservation.");
            const updatedSeats = await getSeatsForShowTime(Number(id));
            setSeats(updatedSeats);
            setSelectedSeatIds([]);
        }
    };


    const getSeatsByRow = () => {
        const rows: { [key: string]: SeatAvailability[] } = {};
        seats.forEach(seat => {
            if (!rows[seat.seatRow]) rows[seat.seatRow] = [];
            rows[seat.seatRow].push(seat);
        });
        Object.keys(rows).sort().forEach(key => {
            rows[key].sort((a, b) => a.seatNumber - b.seatNumber);
        });
        return rows;
    };

    if (loading) return <div className="p-10 text-center">A carregar...</div>;
    if (!session) return <div>Sessão não encontrada.</div>;

    const seatsByRow = getSeatsByRow();

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-2">{session.movieTitle}</h1>
            <p className="text-gray-600 mb-8">Room {session.roomName} | {new Date(session.date).toLocaleString()}</p>
            <p className="text-gray-600 mb-8">Price: {session.price.toFixed(2)} €</p>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 bg-white p-4 rounded shadow">
                    <div className="w-full h-8 bg-gray-300 mb-8 rounded text-center text-xs leading-8 text-gray-600">SCREEN</div>

                    <div className="space-y-3">
                        {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                            <div key={row} className="flex justify-center gap-2">
                                <span className="w-6 text-right font-bold text-gray-400">{row}</span>
                                {rowSeats.map(seat => {
                                    const isSelected = selectedSeatIds.includes(seat.id);
                                    return (
                                        <button
                                            key={seat.id}
                                            disabled={!seat.isAvailable}
                                            onClick={() => toggleSeat(seat.id)}
                                            className={`
                                                w-8 h-8 rounded text-xs font-bold transition-all
                                                ${!seat.isAvailable
                                                ? 'bg-red-500 text-white opacity-50 cursor-not-allowed' // Ocupado
                                                : isSelected
                                                    ? 'bg-blue-600 text-white scale-110' // Selecionado
                                                    : 'bg-green-100 hover:bg-green-200 text-green-800 border border-green-300' // Livre
                                            }
                                            `}
                                        >
                                            {seat.seatNumber}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>


                <div className="w-full md:w-72 bg-gray-50 p-6 rounded h-fit border">
                    <h2 className="font-bold text-xl mb-4">Resume</h2>
                    <div className="space-y-2 text-sm mb-6">
                        <div className="flex justify-between">
                            <span>Seats:</span>
                            <span className="font-bold">{selectedSeatIds.length}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-blue-900 border-t pt-2">
                            <span>Total:</span>
                            <span>{(selectedSeatIds.length * session.price).toFixed(2)} €</span>
                        </div>
                    </div>

                    {isAuthenticated ? (
                        <button
                            onClick={handleReservation}
                            disabled={selectedSeatIds.length === 0}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            Reservar
                        </button>
                    ) : (
                        <Link to="/login" className="block w-full bg-gray-800 text-white py-2 rounded text-center">
                            Login to make a reservation
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SessionPage;