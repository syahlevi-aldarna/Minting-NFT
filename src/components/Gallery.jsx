import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NFTCard from './NFTCard';

const Gallery = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleNFTs, setVisibleNFTs] = useState(6); // Number of NFTs to show initially

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await fetch('/metadata.json'); // Adjust the path as needed
        const data = await response.json();
        setNfts(data.nfts);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const filterNFTs = () => {
    if (activeFilter === 'All') return nfts;
    return nfts.filter(nft => 
      nft.attributes.some(attr => attr.value === activeFilter)
    );
  };

  const loadMore = () => {
    setVisibleNFTs(prev => prev + 6);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section id="nft-gallery" className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Gallery Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
          >
            Featured Collection
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Discover, collect, and trade extraordinary NFTs
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          {['All', 'Art', 'Photography', 'Music', 'Virtual Worlds'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300
                ${activeFilter === filter 
                  ? 'text-white bg-purple-500/50 border-purple-500' 
                  : 'text-gray-300 bg-white/5 border-purple-500/20 hover:border-purple-500/50'
                } 
                border hover:text-white hover:bg-purple-500/20`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* NFT Grid */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filterNFTs()
                .slice(0, visibleNFTs)
                .map((nft) => (
                  <motion.div
                    key={nft.tokenId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <NFTCard {...nft} />
                  </motion.div>
                ))}
            </motion.div>

            {/* Load More Button */}
            {visibleNFTs < filterNFTs().length && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center mt-12"
              >
                <button 
                  onClick={loadMore}
                  className="px-8 py-3 rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                  Load More
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Gallery;