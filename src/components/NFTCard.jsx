import React from 'react';

const NFTCard = ({ tokenId, tokenURI }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300">
      <img src={tokenURI} alt={`NFT ${tokenId}`} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">Token ID: {tokenId}</h3>
        <p className="text-gray-600">{tokenURI}</p>
      </div>
    </div>
  );
};

export default NFTCard;
