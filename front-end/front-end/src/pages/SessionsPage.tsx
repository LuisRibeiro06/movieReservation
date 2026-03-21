import { useEffect, useState } from 'react';
import { getSessions } from '../services/sessionService';
import { Link } from 'react-router-dom';
import type { Session } from '../types';

const SessionsPage = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSessions().then(data => { setSessions(data); setLoading(false); });
    }, []);

    const grouped = sessions.reduce<Record<string, Session[]>>((acc, s) => {
        const key = new Date(s.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
        if (!acc[key]) acc[key] = [];
        acc[key].push(s);
        return acc;
    }, {});

    return (
        <div className="max-w-5xl mx-auto px-8 pt-12 pb-20">
            <div className="fade-up mb-12">
                <p className="text-[0.78rem] tracking-[0.2em] uppercase text-[var(--color-accent)] mb-2">Next</p>
                <h1 className="font-[var(--font-display)] text-[clamp(2.5rem,6vw,4rem)] tracking-wide leading-none">Sessions</h1>
            </div>

            {loading ? (
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="skeleton h-20 rounded-[12px]" />
                    ))}
                </div>
            ) : sessions.length === 0 ? (
                <p className="text-[var(--color-t3)] py-12">No sessions available.</p>
            ) : (
                <div className="flex flex-col gap-10">
                    {Object.entries(grouped).map(([date, daySessions]) => (
                        <div key={date} className="fade-up">
                            <div className="flex items-center gap-4 mb-4">
                                <h2 className="text-[0.76rem] font-semibold tracking-[0.12em] uppercase text-[var(--color-t2)] m-0 whitespace-nowrap">
                                    {date}
                                </h2>
                                <hr className="flex-1 border-none border-t border-white/7" />
                            </div>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-3">
                                {daySessions.map(session => {
                                    const d = new Date(session.date);
                                    return (
                                        <Link to={`/session/${session.id}`} key={session.id} className="no-underline">
                                            <div className="bg-[var(--color-card)] border border-white/7 rounded-xl p-5 flex items-center gap-4 transition-all duration-250 hover:border-[rgba(232,160,32,0.3)] hover:bg-[var(--color-card-h)] cursor-pointer">
                                                {/* Time badge */}
                                                <div className="shrink-0 w-16 text-center px-2 py-2.5 bg-[rgba(232,160,32,0.08)] rounded-lg border border-[rgba(232,160,32,0.2)]">
                                                    <p className="font-[var(--font-display)] text-[1.3rem] text-[var(--color-accent)] leading-none m-0">
                                                        {d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-[0.93rem] text-[var(--color-t1)] mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                                        {session.movieTitle}
                                                    </p>
                                                    <p className="text-[0.76rem] text-[var(--color-t3)] m-0">{session.roomName}</p>
                                                </div>
                                                {/* Price */}
                                                <div className="text-right shrink-0">
                                                    <p className="font-bold text-[0.93rem] text-[var(--color-t1)] m-0">€{session.price.toFixed(2)}</p>
                                                    <p className="text-[0.68rem] font-semibold text-[var(--color-accent)] mt-0.5 m-0">Book →</p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SessionsPage;
