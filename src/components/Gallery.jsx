import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { motion } from 'framer-motion';
import { EyeIcon, HeartIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const NFTCard = ({ tokenId, tokenURI }) => {
  const [nftData, setNftData] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(tokenURI);
        const data = await response.json();
        setNftData(data);
      } catch (error) {
        console.error('Error fetching NFT metadata:', error);
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
      transition={{ duration: 0.5 }}
      className="group relative bg-gradient-to-b from-[#2E0249]/70 to-[#570A57]/50 rounded-2xl overflow-hidden backdrop-blur-xl border border-[#7A0BC0]/30 hover:border-[#FA58B6]/50 transition-all duration-300 shadow-lg"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={nftData?.image || '/api/placeholder/400/400'}
          alt={`NFT #${tokenId}`}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-white">
          {nftData?.name || `NFT #${tokenId}`}
        </h3>
        <p className="mt-2 text-gray-300 text-sm">
          {nftData?.description || 'No description available'}
        </p>
        <div className="mt-4 flex items-center justify-between text-gray-300">
          <span className="flex items-center">
            <HeartIcon className="w-5 h-5 mr-1 text-pink-400" />
            124
          </span>
          <span className="flex items-center">
            <EyeIcon className="w-5 h-5 mr-1" />
            1.2K
          </span>
          <span className="flex items-center text-green-400">
            <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
            +12%
          </span>
        </div>
        <div className="mt-6 pt-4 border-t border-[#7A0BC0]/30">
          <button className="w-full py-3 bg-[#7A0BC0] hover:bg-[#9D44B5] text-white rounded-lg transition-all">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Gallery = () => {
  const { account, provider } = useWallet();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const contractABI = [
    "function tokenURI(uint256 tokenId) public view returns (string memory)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
    "function balanceOf(address owner) public view returns (uint256)"
  ];
  const contractAddress = '0x35740E2ca93050D0d8266167bF26B5dBB5F85E2f';

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!provider || !account) {
        setLoading(false);
        return;
      }

      try {
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const balance = await contract.balanceOf(account);
        
        let nftArray = [];
        for (let i = 0; i < balance.toNumber(); i++) {
          try {
            const tokenId = await contract.tokenOfOwnerByIndex(account, i);
            const tokenURI = await contract.tokenURI(tokenId);
            nftArray.push({ tokenId: tokenId.toString(), tokenURI });
          } catch (err) {
            console.error('Error fetching token data:', err);
          }
        }

        setNfts(nftArray);
      } catch (err) {
        console.error('Error fetching NFTs:', err);
        setError('Failed to load NFTs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [account, provider]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#7A0BC0] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <div className="bg-red-500/10 text-red-500 p-6 rounded-xl">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-white mb-8">Your NFT Collection</h2>
      {nfts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-300 text-xl">You don't have any NFTs yet. Start minting!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <NFTCard key={nft.tokenId} {...nft} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;