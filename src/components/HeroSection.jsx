import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GlobeAltIcon, SparklesIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';

const HeroSection = () => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      buttonRef.current.style.setProperty("--x", `${x}px`);
      buttonRef.current.style.setProperty("--y", `${y}px`);
    };

    const button = buttonRef.current;
    button?.addEventListener("mousemove", handleMouseMove);

    return () => button?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black to-purple-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6 pt-32 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Masa Depan NFT
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Jelajahi, Ciptakan, dan Koleksi NFT Unik di Platform Terdesentralisasi Kami
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12">
            <button
              ref={buttonRef}
              className="relative inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Mulai Minting
              <SparklesIcon className="w-5 h-5 ml-2" />
            </button>
            
            <button className="px-8 py-4 text-lg font-semibold text-white border-2 border-purple-500 rounded-xl hover:bg-purple-500/20 transition-all duration-300">
              Jelajahi Galeri
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {[
            { icon: GlobeAltIcon, label: "NFT Terjual", value: "10,000+" },
            { icon: SparklesIcon, label: "Total Kreator", value: "5,000+" },
            { icon: CubeTransparentIcon, label: "Volume Trading", value: "100 ETH+" }
          ].map(({ icon: Icon, label, value }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg"
            >
              <Icon className="w-8 h-8 text-purple-400 mx-auto" />
              <p className="mt-4 text-3xl font-bold text-white">{value}</p>
              <p className="mt-2 text-gray-400">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;