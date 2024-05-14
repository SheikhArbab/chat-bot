import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoClose } from 'react-icons/io5';

const Chat = ({ isOpen, setIsOpen }) => {
    const [newMessage, setNewMessage] = useState('');
    const [showTyping, setShowTyping] = useState(false);
    const [waitingOnResponse, setWaitingOnResponse] = useState(false);
    const [messages, setMessages] = useState([]);

    // Set the base URL for Axios requests
    axios.defaults.baseURL = "https://samar-bot.onrender.com/";

    // Function to fetch response from the backend
    const getGptResponse = async () => {
        try {
            const response = await axios.post('gpt', { prompt: newMessage });
            return response.data;
        } catch (error) {
            console.error('Error fetching response:', error);
            return null;
        }
    };

    // Function to send user message and receive response
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || waitingOnResponse) return;
        setWaitingOnResponse(true);
        setMessages([...messages, { role: "user", body: newMessage }]);
        setNewMessage('');
        window.scrollTo(0, document.body.scrollHeight); // Scroll to bottom

        // Fetch response from backend
        const response = await getGptResponse();
        if (response) {
            // Add response to messages
            setMessages([...messages, { role: "assistant", body: response }]);
        }
        setWaitingOnResponse(false);
    };

    useEffect(() => {
        // Initial message when component mounts
        if (isOpen) {
            setMessages([{ role: "assistant", body: "Hello! How can I assist you?" }]);
        }
    }, [isOpen]);

    return (
        <div className="w-96 h-screen relative pb-16 flex flex-col ms-auto">

            <div className="w-full  max-w-screen-lg flex-1 m-auto p-8 my-4 pb-20 overflow-y-auto">
                <button onClick={() => setIsOpen(!isOpen)} className='cursor-pointer absolute top-5 z-40 text-red-500 right-10'><IoClose /></button>
                <div className="flex flex-col">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message rounded-lg py-2 px-6 mb-4 ${message.role === 'assistant'
                                ? 'assistant bg-blue-100 border-blue-100 self-start'
                                : 'user bg-green-200 border-green-200 self-end'
                                }`}
                        >
                            <span>{message.body}</span>
                        </div>
                    ))}
                    {showTyping && (
                        <div className="message assistant rounded-lg py-2.5 px-6 mb-4 bg-blue-100 border-blue-100 self-start">
                            <div className="type-indicator">
                                <span>.</span><span>.</span><span>.</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute bottom-0 bg-gray-200 w-full ">
                <form
                    className="max-w-screen-lg m-auto w-full p-4 flex space-x-4 justify-center items-center"
                    onSubmit={sendMessage}
                >
                    <input
                        id="message"
                        type="text"
                        autoComplete="off"
                        className="border rounded-md p-2 flex-1 border-gray-300"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Your message..."
                    />
                    <button
                        className={`bg-gray-800 text-white px-4 py-2 rounded-md ${waitingOnResponse ? 'opacity-50' : ''
                            }`}
                        type="submit"
                        disabled={waitingOnResponse}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
