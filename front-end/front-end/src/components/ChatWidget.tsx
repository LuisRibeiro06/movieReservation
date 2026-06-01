import { useState } from 'react';
import api from '../services/api';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post('/chat', { message: userMsg });
            setMessages(prev => [...prev, { role: 'bot', text: response.data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', text: "Sorry, something went wrong" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <div className="bg-[#12121c] border border-gray-700 w-80 h-96 rounded-lg shadow-2xl flex flex-col mb-4">
                    <div className="bg-[var(--color-accent)] p-3 rounded-t-lg font-bold text-black">
                        🍿 CineBot
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2 text-sm text-gray-200">
                        {messages.length === 0 && <p className="text-gray-400 italic">How can I help you today?</p>}
                        {messages.map((msg, i) => (
                            <div key={i} className={`p-2 rounded-lg max-w-[85%] ${msg.role === 'user' ? 'bg-blue-600 self-end' : 'bg-gray-700 self-start'}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && <div className="text-gray-400 text-xs">Digitando...</div>}
                    </div>

                    <div className="p-3 border-t border-gray-700 flex">
                        <input
                            type="text"
                            className="flex-1 bg-transparent border-b border-gray-500 focus:outline-none text-white px-2"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Ask something..."
                        />
                        <button onClick={sendMessage} className="ml-2 text-[var(--color-accent)] font-bold">Send</button>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[var(--color-accent)] text-black w-14 h-14 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center text-2xl"
            >
                💬
            </button>
        </div>
    );
}