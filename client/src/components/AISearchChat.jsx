import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, MessageSquare, Search, ArrowRight, Zap, Stars } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const AISearchChat = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hello! I'm your AI Diamond Assistant. How can I help you find the perfect stone today?",
    },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      type: "user",
      text: message,
    };

    setChatHistory((prev) => [...prev, newUserMessage]);
    setMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: "bot",
        text: "I'm searching our global inventory for that... (This is a preview UI. Backend integration coming soon!)",
      };
      setChatHistory((prev) => [...prev, botResponse]);
    }, 1000);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-12 sm:bottom-12 right-6 z-[9999] font-sans">

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed sm:absolute bottom-24 left-4 right-4 sm:left-auto sm:right-0 w-auto sm:w-[300px] md:w-[320px] lg:w-[340px] bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden flex flex-col"
            style={{
              maxHeight: "min(600px, calc(100vh - 180px))",
              height: "auto"
            }}
          >
            {/* Header */}
            <div className="bg-[#101E4D] p-5 text-white relative overflow-hidden flex-shrink-0">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-none">AI Assistant</h3>
                    <p className="text-[10px] text-blue-200 mt-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                      Online
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8FAFC] scroll-smooth"
            >
              {chatHistory.map((item) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={item.id}
                  className={`flex ${item.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[88%] ${item.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm ${item.type === "user"
                      ? "bg-[#101E4D] text-white"
                      : "bg-white text-[#101E4D] border border-gray-100"
                      }`}>
                      {item.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${item.type === "user"
                      ? "bg-[#101E4D] text-white rounded-tr-none"
                      : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                      }`}>
                      {item.text}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
              {/* Quick Suggestions */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3 pb-1">
                {["Natural Diamond", "Lab Grown Diamonds", "Jewelry", "Lab grown Jewelry", "Fancy Shape", "Fancy Color", "Color Stone"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setMessage(suggestion)}
                    className="whitespace-nowrap px-3 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-[#101E4D] text-[10px] font-bold rounded-xl border border-gray-100 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask something..."
                  className="w-full pl-3 pr-10 py-2.5 bg-gray-50 focus:bg-white border-2 border-transparent focus:border-blue-100 rounded-xl text-[12px] transition-all outline-none font-medium text-gray-700 shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#101E4D] text-white rounded-lg hover:bg-blue-900 transition-all transform active:scale-90 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="mt-2 flex flex-col items-center">
                <p className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">
                  PlatinumTech AI Search
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fully Animated Circular Toggle Button */}
      <div className="relative group">
        {/* Exterior Glow Aura */}
        {!isOpen && (
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-[-8px] rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 blur-xl opacity-40"
          />
        )}

        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative z-10 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-500 shadow-[0_15px_40px_rgba(30,58,138,0.3)] border border-white/20 ${isOpen
              ? "bg-white text-[#101E4D]"
              : "bg-gradient-to-br from-[#101E4D] via-[#1E3A8A] to-[#3B82F6] text-white"
            }`}
        >
          {/* Internal Pulse */}
          {!isOpen && (
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-white rounded-full"
            />
          )}

          {isOpen ? (
            <X className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 hover:rotate-90" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Search className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg" />
              <motion.div
                animate={{
                  y: [-2, 2, -2],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-3 h-3 text-blue-200 fill-blue-200" />
              </motion.div>
            </div>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default AISearchChat;
