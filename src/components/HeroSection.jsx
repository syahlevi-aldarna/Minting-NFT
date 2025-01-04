import React from 'react';
import { motion } from 'framer-motion';
import { Globe2, Sparkles, Box } from 'lucide-react';

const HeroSection = () => {

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative container mx-auto px-6 pt-32 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            The Future of NFTs
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Explore, Create, and Collect Unique NFTs on our Decentralized Platform
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('minting-section')}
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center"
            >
              Start Minting
              <Sparkles className="w-5 h-5 ml-2" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('nft-gallery')} // Changed from 'gallery-section' to 'nft-gallery'
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white border-2 border-purple-500 rounded-xl hover:bg-purple-500/20 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center"
            >
              Explore Gallery
              <Box className="w-5 h-5 ml-2" />
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-24">
          {[
            { icon: Globe2, label: "NFTs Sold", value: "10,000+" },
            { icon: Sparkles, label: "Total Creators", value: "5,000+" },
            { icon: Box, label: "Trading Volume", value: "100 ETH+" }
          ].map(({ icon: Icon, label, value }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-500/30"
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
