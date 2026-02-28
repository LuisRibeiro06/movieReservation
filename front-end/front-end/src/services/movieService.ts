import api from './api';
import type {Movie, OmdbSearchResult} from '../types';

export const getMovies = async (): Promise<Movie[]> => {
    const response = await api.get('/movies');
    return response.data;
};

export const searchOmdb = async (query: string): Promise<OmdbSearchResult[]> => {
    const response = await api.get<OmdbSearchResult[]>('/movies/search', {
        params: { query }
    });
    return response.data;
};

export const importMovie = async (imdbId: string): Promise<Movie> => {
    const response = await api.post<Movie>('/movies/import', null, {
        params: { imdbId }
    });
    return response.data;
};

export const deleteMovie = async (id: number) => {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
}

export const getMovieById = async (id: number): Promise<Movie> => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
};