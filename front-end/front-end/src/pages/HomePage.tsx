import { useEffect, useState } from 'react';
import { getMovies } from '../services/movieService';
import { Link } from 'react-router-dom';
import type { Movie } from '../types';

const HomePage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMovies().then(data => { setMovies(data); setLoading(false); });
    }, []);

    return (
        <div>
            {/* Hero */}
            <div className="relative max-w-7xl mx-auto px-8 pt-20 pb-16">
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[500px] h-48 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, rgba(232,160,32,0.08) 0%, transparent 70%)' }} />
                <p className="fade-up text-[0.78rem] tracking-[0.2em] uppercase text-[var(--color-accent)] mb-3">
                    Now showing
                </p>
                <h1 className="fade-up-1 font-[var(--font-display)] text-[clamp(2.5rem,6vw,4rem)] tracking-wide leading-none mb-4">
                    What will you<br />watch tonight?
                </h1>
                <p className="fade-up-2 text-[var(--color-t2)] text-[0.95rem]">
                    {movies.length} films available
                </p>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-8 pb-20">
                {loading ? (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="skeleton aspect-[2/3] rounded-[18px]" />
                        ))}
                    </div>
                ) : movies.length === 0 ? (
                    <p className="text-center py-16 text-[var(--color-t3)]">No films available.</p>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-6">
                        {movies.map((movie, i) => (
                            <Link
                                to={`/movie/${movie.id}`}
                                key={movie.id}
                                className="no-underline group fade-up"
                                style={{ animationDelay: `${i * 0.04}s` }}
                            >
                                <div className="relative overflow-hidden rounded-[18px] cursor-pointer transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.02] group-hover:shadow-[0_24px_48px_rgba(0,0,0,0.6),0_0_0_1px_rgba(232,160,32,0.3)]">
                                    <img
                                        src={movie.posterImage}
                                        alt={movie.title}
                                        loading="lazy"
                                        className="movie-card-img w-full aspect-[2/3] object-cover block transition-transform duration-300"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/300x450/0f0f18/4a4858?text=No+Poster';
                                        }}
                                    />
                                    {/* Static bottom gradient */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5"
                                        style={{ background: 'linear-gradient(to top, rgba(8,8,14,0.95), transparent)' }}>
                                        <p className="font-semibold text-[0.84rem] text-[var(--color-t1)] mb-1 leading-snug">{movie.title}</p>
                                        <p className="text-[0.7rem] text-[var(--color-t2)] m-0">{movie.genre}</p>
                                    </div>
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ background: 'linear-gradient(to top, rgba(8,8,14,0.97) 0%, rgba(8,8,14,0.5) 50%, transparent 100%)' }}>
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.68rem] font-semibold tracking-wide uppercase bg-[rgba(232,160,32,0.12)] text-[var(--color-accent)] border border-[rgba(232,160,32,0.3)] mb-2 self-start">
                                            {movie.duration} min
                                        </span>
                                        <p className="text-[0.76rem] text-[rgba(240,237,232,0.7)] leading-relaxed line-clamp-3 mb-2">
                                            {movie.description}
                                        </p>
                                        <span className="text-[0.76rem] font-semibold text-[var(--color-accent)]">
                                            View details →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
