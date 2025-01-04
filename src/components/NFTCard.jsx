import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, HeartIcon, ArrowTrendingUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const NFTCard = ({ tokenId, tokenURI }) => {
  const [nftData, setNftData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const response = await fetch(tokenURI);
        const data = await response.json();
        setNftData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching NFT metadata:', error);
        setError('Failed to load NFT metadata');
      } finally {
        setLoading(false);
      }
    };

    if (tokenURI) {
      fetchMetadata();
    }
  }, [tokenURI]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      id="nft-card-section"
      className="group relative bg-gradient-to-b from-gray-900 to-purple-900 rounded-2xl overflow-hidden backdrop-blur-xl border border-purple-500/30 hover:border-pink-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
    >
      <div className="aspect-square overflow-hidden relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-900/20">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/20 text-red-400">
            <ExclamationCircleIcon className="w-8 h-8 mb-2" />
            <p className="text-sm text-center px-4">{error}</p>
          </div>
        ) : (
          <img
            src={nftData?.image || '/api/placeholder/400/400'}
            alt={`NFT #${tokenId}`}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2 truncate">
          {nftData?.name || `NFT #${tokenId}`}
        </h3>
        <p className="mt-2 text-gray-300 text-sm line-clamp-2 h-10">
          {nftData?.description || 'No description available'}
        </p>

        <div className="mt-4 flex items-center justify-between text-gray-300">
          <motion.span 
            whileHover={{ scale: 1.1 }}
            className="flex items-center cursor-pointer hover:text-pink-400 transition-colors"
          >
            <HeartIcon className="w-5 h-5 mr-1" />
            <span className="text-sm">124</span>
          </motion.span>

          <motion.span 
            whileHover={{ scale: 1.1 }}
            className="flex items-center cursor-pointer hover:text-blue-400 transition-colors"
          >
            <EyeIcon className="w-5 h-5 mr-1" />
            <span className="text-sm">1.2K</span>
          </motion.span>

          <motion.span 
            whileHover={{ scale: 1.1 }}
            className="flex items-center cursor-pointer text-green-400 hover:text-green-300 transition-colors"
          >
            <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
            <span className="text-sm">+12%</span>
          </motion.span>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all shadow-lg hover:shadow-purple-500/25"
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NFTCard;
