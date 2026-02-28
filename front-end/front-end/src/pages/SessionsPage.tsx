import { useEffect, useState } from 'react';
import { getSessions } from '../services/sessionService';
import { Link } from 'react-router-dom';
import type { Session } from '../types';

const SessionsPage = () => {
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        const fetchSessions = async () => {
            const sessions = await getSessions();
            setSessions(sessions);
        };
        fetchSessions();
    }, []);

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Available Sessions</h1>
            {sessions.length === 0 ? (
                <p>No sessions available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {sessions.map(session => (
                        <div key={session.id} className="border rounded p-4">
                            <Link to={`/movie/${session.movieId}`}>
                                <h2 className="font-bold">{session.movieTitle}</h2>
                                <p>{new Date(session.date).toLocaleString()}</p>
                                <p>{session.roomName}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SessionsPage;
