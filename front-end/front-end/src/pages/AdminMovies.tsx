import { useEffect, useState } from 'react';
import { getMovies, searchOmdb, importMovie, deleteMovie } from '../services/movieService';
import type { Movie, OmdbSearchResult } from '../types';

const AdminMovies = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<OmdbSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const fetchMyMovies = async () => {
        try {
            const data = await getMovies();
            setMovies(data);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    useEffect(() => {
        fetchMyMovies();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery) return;

        setIsSearching(true);
        try {
            const results = await searchOmdb(searchQuery);
            setSearchResults(results || []);
        } catch (error) {
            alert("Error searching on OMDb.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleImport = async (imdbId: string) => {
        setIsImporting(true);
        try {
            await importMovie(imdbId);
            alert("Movie imported successfully!");
            setSearchResults([]);
            setSearchQuery('');
            fetchMyMovies();
        } catch (error) {
            alert("Error importing movie.");
        } finally {
            setIsImporting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this movie?")) return;

        try {
            await deleteMovie(id);
            setMovies(movies.filter(m => m.id !== id));
        } catch (error) {
            alert("Error deleting movie.");
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-8 relative text-white">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none"
                 style={{ background: 'radial-gradient(ellipse, rgba(232,160,32,0.05) 0%, transparent 70%)' }} />

            <div className="fade-up w-full max-w-6xl bg-[var(--color-card)] border border-white/7 rounded-[18px] p-10 my-8">
                <h1 className="font-[var(--font-display)] text-[2rem] tracking-widest mb-6 text-center">Manage Movies</h1>

                <div className="bg-[var(--color-surface)] border border-white/10 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Import New Movie</h2>
                    <form onSubmit={handleSearch} className="flex gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Movie title (e.g., Inception)"
                            className="flex-1 px-4 py-3 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-t1)] placeholder:text-[var(--color-t3)] outline-none focus:border-[var(--color-accent)]"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={isSearching}
                            className="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-[#0a0810] font-semibold hover:bg-[#f0b030] disabled:bg-gray-500"
                        >
                            {isSearching ? 'Searching...' : 'Search OMDb'}
                        </button>
                    </form>

                    {searchResults.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                            {searchResults.map(result => (
                                <div key={result.imdbID} className="bg-[var(--color-card)] border border-white/10 p-3 rounded-lg hover:shadow-lg transition">
                                    <img src={result.Poster} alt={result.Title} className="w-full h-48 object-cover mb-2 rounded" />
                                    <h3 className="font-bold text-sm truncate">{result.Title}</h3>
                                    <p className="text-xs text-gray-400 mb-2">{result.Year}</p>
                                    <button
                                        onClick={() => handleImport(result.imdbID)}
                                        disabled={isImporting}
                                        className="w-full bg-green-500 text-white text-xs py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                                    >
                                        Import
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-[var(--color-surface)] border border-white/10 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Movies List ({movies.length})</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="p-3 text-[var(--color-t2)]">ID</th>
                                    <th className="p-3 text-[var(--color-t2)]">Poster</th>
                                    <th className="p-3 text-[var(--color-t2)]">Title</th>
                                    <th className="p-3 text-[var(--color-t2)]">Genre</th>
                                    <th className="p-3 text-[var(--color-t2)]">Description</th>
                                    <th className="p-3 text-[var(--color-t2)]">Duration</th>
                                    <th className="p-3 text-right text-[var(--color-t2)]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movies.map(movie => (
                                    <tr key={movie.id} className="border-b border-white/10 hover:bg-white/5">
                                        <td className="p-3 text-gray-400">#{movie.id}</td>
                                        <td className="p-3">
                                            <img src={movie.posterImage} alt="" className="w-10 h-14 object-cover rounded" />
                                        </td>
                                        <td className="p-3 font-medium">{movie.title}</td>
                                        <td className="p-3">{movie.genre}</td>
                                        <td className="p-3 truncate max-w-xs">{movie.description}</td>
                                        <td className="p-3">{movie.duration} min</td>
                                        <td className="p-3 text-right space-x-2">
                                            <button
                                                onClick={() => handleDelete(movie.id)}
                                                className="text-red-500 hover:text-red-700 bg-red-50/10 px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMovies;
