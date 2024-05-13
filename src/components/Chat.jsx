import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = () => {
    const [newMessage, setNewMessage] = useState('');
    const [showTyping, setShowTyping] = useState(false);
    const [waitingOnResponse, setWaitingOnResponse] = useState(true);
    const [messages, setMessages] = useState([]);

    axios.defaults.baseURL = "https://fakestoreapi.com/";

    const getProducts = async () => {
      try {
        const res = await axios.get('products');
        console.log(res);
      } catch (error) {
        console.error('Error fetching products:', error);
  
      }
  
    }
  
    useEffect(() => {
      getProducts();
    }, []);

    // Demo variables
    const mockTypingAfter = 1500;
    const mockResponseAfter = 3000;
    const mockOpeningMessage =
        "Hello there. I am chat bot. Created by Arbab. Aks me anything you want. I will not have a usefull response. I will just echo what you sent me.";
    const mockResponsePrefix = "Thanks for sending me: ";

    useEffect(() => {
        init();
    }, []);

    const init = () => {
        mockResponse(mockOpeningMessage);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (waitingOnResponse) return;
        setWaitingOnResponse(true);
        setMessages([...messages, { role: "user", body: newMessage }]);
        setNewMessage('');
        window.scrollTo(0, document.body.scrollHeight); // Scroll to bottom
        mockResponse();
    };

    const typeOutResponse = (message) => {
        const updatedMessages = [...messages];
        updatedMessages.push({ role: "assistant", body: "", beingTyped: true });
        setMessages(updatedMessages);
        let i = 0;
        let interval = setInterval(() => {
            updatedMessages[updatedMessages.length - 1].body += message.charAt(i);
            i++;
            if (i > message.length - 1) {
                setWaitingOnResponse(false);
                delete updatedMessages[updatedMessages.length - 1].beingTyped;
                clearInterval(interval);
                setMessages(updatedMessages);
            }
        }, 30);
    };

    const mockResponse = (message) => {
        setTimeout(() => {
            setShowTyping(true);
        }, mockTypingAfter);
        setTimeout(() => {
            setShowTyping(false);
            let responseMessage =
                message ?? mockResponsePrefix + messages[messages.length - 1].body;
            typeOutResponse(responseMessage);
        }, mockResponseAfter);
    };

    return (
        <div className="w-96 h-screen relative pb-16 flex flex-col ms-auto"> 

            <div className="w-full  max-w-screen-lg flex-1 m-auto p-8 my-4 pb-20 overflow-y-auto">
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
                            {message.beingTyped && (
                                <span className="w-2.5 bg-gray-600 h-4 inline-block -mb-0.5 align-baseline blink"></span>
                            )}
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
