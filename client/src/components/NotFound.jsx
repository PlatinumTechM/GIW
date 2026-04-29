import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Diamond } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background gradients and patterns similar to Home page */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#b8e2f2] via-[#f8fafc] to-[#ffffff] opacity-70" />

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='90' height='90' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0z' fill='%232e7c9e' fill-opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "90px 90px",
        }}
      />

      {/* Glow Orbs - matching Home page accents */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-[#2e7c9e]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#4aa3c7]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative inline-block"
        >
          <h1 className="text-[10rem] sm:text-[12rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#2e7c9e] via-[#4aa3c7] to-[#2e7c9e] leading-none drop-shadow-xl select-none">
            404
          </h1>
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotateZ: [0, -5, 5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 text-[#2e7c9e] bg-white rounded-full p-2 shadow-lg border border-[#2e7c9e]/20"
          >
            <Diamond className="w-10 h-10 sm:w-12 sm:h-12 fill-[#b8e2f2]" />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mt-8 mb-4 tracking-tight text-[#0F172A]"
        >
          Oops! Page Not Found
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-[#475569] text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed"
        >
          It seems you've ventured outside our diamond network. The page you're looking for has been moved or doesn't exist.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => window.history.back()}
            className="group flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-50 text-[#0F172A] rounded-full font-semibold transition-all duration-300 border-2 border-[#CBD5E1] hover:border-[#2e7c9e]/50 w-full sm:w-auto shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform text-[#475569]" />
            Go Back
          </button>

          <Link
            to="/"
            className="group flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#2e7c9e] to-[#4aa3c7] hover:from-[#256682] hover:to-[#3e8cae] text-white rounded-full font-semibold transition-all duration-300 shadow-[0_8px_20px_rgba(46,124,158,0.25)] hover:shadow-[0_10px_25px_rgba(46,124,158,0.35)] hover:-translate-y-0.5 w-full sm:w-auto"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Back to Home
          </Link>
        </motion.div>
      </div>

      {/* Footer text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 text-[#475569] text-sm font-medium tracking-wide"
      >
        GIW &copy; {new Date().getFullYear()}
      </motion.div>
    </div>
  );
};

export default NotFound;
