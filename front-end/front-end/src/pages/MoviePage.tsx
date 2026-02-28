import { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
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
        const fetchMovieData = async () => {
            if (!id) {
                setError("Movie ID not provided.");
                setLoading(false);
                return;
            }
            try {
                const numericId = parseInt(id, 10);
                if (isNaN(numericId)) {
                    setError("Invalid Movie ID.");
                    setLoading(false);
                    return;
                }

                const movieResponse = await getMovieById(numericId);
                setMovie(movieResponse);

                const sessionsResponse = await getSessionsByMovieId(numericId);
                if (Array.isArray(sessionsResponse)) {
                    setSessions(sessionsResponse);
                } else {
                    setSessions([]);
                }
            } catch (err) {
                setError('Failed to fetch movie data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!movie) {
        return <div>Movie not found.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                    <img src={movie.posterImage} alt={movie.title} className="w-full h-auto rounded-lg shadow-lg"/>
                </div>
                <div className="md:w-2/3 md:pl-8">
                    <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
                    <p className="mb-4">{movie.description}</p>
                    <p className="mb-4"><strong>Duration:</strong> {movie.duration} minutes</p>
                    <p className="mb-4"><strong>Genre:</strong> {movie.genre}</p>
                    <p className="mb-4"><strong>IMDB ID:</strong> {movie.imdbId}</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Available Sessions</h2>
            {sessions.length > 0 ? (
                <ul className="list-disc pl-5">
                    {sessions.map(session => (
                        <div key={session.id} className="border rounded p-4">
                        <Link to={`/session/${session.id}`}>
                            <h2 className="font-bold">{session.movieTitle}</h2>
                            <p>{new Date(session.date).toLocaleString()}</p>
                            <p>{session.roomName}</p>
                        </Link>
                        </div>
                    ))}
                </ul>
            ) : (
                <p>No available sessions for this movie.</p>
            )}
        </div>
    );
};

export default MoviePage;
