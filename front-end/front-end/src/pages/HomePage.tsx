import { useEffect, useState } from 'react';
import { getMovies } from '../services/movieService';
import { Link } from 'react-router-dom';
import type {Movie} from '../types';

const HomePage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchMovies = async () => {
            const movies = await getMovies();
            setMovies(movies);
        };
        fetchMovies();
    }, []);

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Movies</h1>
            {movies.length === 0 ? (
                <p>No movies to display.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {movies.map(movie => (
                        <div key={movie.title} className="border rounded">
                            <Link to={`/movie/${movie.id}`}>
                                <img src={movie.posterImage} alt={movie.title} className="w-full h-64 object-cover"/>
                                <div className="p-4">
                                    <h2 className="font-bold">{movie.title}</h2>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;