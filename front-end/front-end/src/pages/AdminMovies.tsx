
import { useEffect, useState } from 'react';
import  { getMovies, searchOmdb, importMovie, deleteMovie } from '../services/movieService';
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

    // 2. Importar Filme
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

    // 3. Apagar Filme
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
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Movies List</h1>
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-semibold mb-4 text-blue-600">Import new movie</h2>
                <form onSubmit={handleSearch} className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Movie title (Ex: Inception)"
                        className="flex-1 border p-2 rounded"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {isSearching ? 'Searching...' : 'Pesquisar OMDb'}
                    </button>
                </form>

                {searchResults.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                        {searchResults.map(result => (
                            <div key={result.imdbID} className="border p-2 rounded hover:shadow-lg transition">
                                <img src={result.Poster} alt={result.Title} className="w-full h-48 object-cover mb-2 rounded" />
                                <h3 className="font-bold text-sm truncate">{result.Title}</h3>
                                <p className="text-xs text-gray-500 mb-2">{result.Year}</p>
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


            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Movies List ({movies.length})</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3">ID</th>
                            <th className="p-3">Poster</th>
                            <th className="p-3">Title</th>
                            <th className="p-3">Genre</th>
                            <th className="p-3">Description</th>
                            <th className="p-3">Duration</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {movies && movies.length > 0 ? (
                            movies.map(movie => (
                                <tr key={movie.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 text-gray-500">#{movie.id}</td>
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
                                            className="text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-500">
                                    {movies ? "No movies to display." : "Loading..."}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminMovies;