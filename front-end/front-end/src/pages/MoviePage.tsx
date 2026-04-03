import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMovieById } from '../services/movieService';
import { getSessionsByMovieId } from '../services/sessionService';
import type { Movie, Session } from '../types';

const MoviePage = () => {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const numericId = parseInt(id, 10);
        Promise.all([getMovieById(numericId), getSessionsByMovieId(numericId)])
            .then(([movieData, sessionsData]) => {
                setMovie(movieData);
                setSessions(Array.isArray(sessionsData) ? sessionsData : []);
            })
            .catch(() => setError('Failed to load film.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center text-[var(--color-t3)]">Loading…</div>
    );
    if (error || !movie) return (
        <div className="min-h-[60vh] flex items-center justify-center text-red-400">{error || 'Film not found.'}</div>
    );

    return (
        <div>
            {/* Blurred hero backdrop */}
            <div className="relative overflow-hidden h-[400px]">
                <img src={movie.posterImage} alt="" className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 saturate-50 opacity-25" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, var(--color-base) 100%)' }} />
            </div>

            {/* Main content — overlaps hero */}
            <div className="max-w-5xl mx-auto px-8 pb-20 relative" style={{ marginTop: '-260px' }}>
                <div className="flex gap-10 flex-wrap items-end">

                    {/* Poster */}
                    <div className="fade-up w-[190px] shrink-0 rounded-[18px] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.8)] border border-white/10">
                        <img src={movie.posterImage} alt={movie.title} className="w-full block" />
                    </div>

                    {/* Info */}
                    <div className="fade-up-1 flex-1 min-w-[260px] pb-2">
                        <div className="flex gap-2 flex-wrap mb-4">
                            <span className="px-2.5 py-1 rounded-full text-[0.68rem] font-semibold tracking-wide uppercase bg-[rgba(232,160,32,0.12)] text-[var(--color-accent)] border border-[rgba(232,160,32,0.3)]">
                                {movie.genre}
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-[0.68rem] font-semibold tracking-wide uppercase bg-[var(--color-surface)] text-[var(--color-t2)] border border-white/10">
                                {movie.duration} min
                            </span>
                        </div>
                        <h1 className="font-[var(--font-display)] text-[clamp(2rem,5vw,3.5rem)] tracking-wide leading-none mb-5">
                            {movie.title}
                        </h1>
                        <p className="text-[var(--color-t2)] leading-relaxed text-[0.9rem] max-w-lg">
                            {movie.description}
                        </p>
                    </div>
                </div>

                {movie.trailerUrl && (
                    <div className="fade-up-2 mt-14">
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className="font-[var(--font-display)] text-[1.6rem] tracking-widest m-0 shrink-0">TRAILER</h2>
                            <hr className="flex-1 border-none border-t border-white/10" />
                        </div>

                        <div className="max-w-3xl">
                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <iframe
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                    src={`https://www.imdb.com/video/embed/${movie.trailerUrl}`}
                                    title={`${movie.title} Trailer`}
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sessions */}
                <div className="fade-up-2 mt-14">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="font-[var(--font-display)] text-[1.6rem] tracking-widest m-0 shrink-0">SESSIONS</h2>
                        <hr className="flex-1 border-none border-t border-white/10" />
                    </div>

                    {sessions.length === 0 ? (
                        <p className="text-[var(--color-t3)] py-8">No sessions available for this film.</p>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
                            {sessions.map(session => {
                                const d = new Date(session.date);
                                return (
                                    <Link to={`/session/${session.id}`} key={session.id} className="no-underline">
                                        <div className="bg-[var(--color-card)] border border-white/7 rounded-[18px] p-5 cursor-pointer transition-all duration-250 hover:border-[rgba(232,160,32,0.3)] hover:bg-[var(--color-card-h)]">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="font-semibold text-[0.95rem] text-[var(--color-t1)] mb-0.5">
                                                        {d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                    </p>
                                                    <p className="font-[var(--font-display)] text-[1.4rem] tracking-wide text-[var(--color-accent)] m-0">
                                                        {d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                <span className="font-bold text-[0.95rem] text-[var(--color-t1)]">
                                                    €{session.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="text-[0.76rem] text-[var(--color-t3)] mb-3">🎪 {session.roomName}</p>
                                            <p className="text-[0.76rem] font-semibold text-[var(--color-accent)] m-0">Select seats →</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MoviePage;
