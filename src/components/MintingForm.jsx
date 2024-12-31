import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { ethers } from 'ethers';

export function MintingForm() {
  const { account, provider } = useWallet();
  const [minting, setMinting] = useState(false);
  const [tokenURI, setTokenURI] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const contractABI = [
    "function createNFT(string memory tokenURI) public returns (uint256)",
    "function owner() public view returns (address)"
  ];
  const contractAddress = '0x35740E2ca93050D0d8266167bF26B5dBB5F85E2f';

  const handleMint = async () => {
    if (!account) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (!tokenURI) {
      setStatus({ type: 'error', message: 'Please enter a valid token URI' });
      return;
    }

    try {
      setMinting(true);
      setStatus({ type: 'info', message: 'Validating metadata...' });
      
      const response = await fetch(tokenURI);
      if (!response.ok) {
        throw new Error('Invalid Token URI: Unable to fetch metadata');
      }

      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      setStatus({ type: 'info', message: 'Please confirm the transaction in your wallet...' });
      
      const transaction = await contract.createNFT(tokenURI);
      setStatus({ type: 'info', message: 'Transaction submitted. Waiting for confirmation...' });

      const receipt = await transaction.wait();
      
      if (receipt.status === 1) {
        setStatus({ type: 'success', message: 'NFT Minted Successfully!' });
        setTokenURI('');
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Minting failed:', error);
      setStatus({ 
        type: 'error', 
        message: `Failed to mint NFT: ${error.message || 'Unknown error occurred'}`
      });
    } finally {
      setMinting(false);
    }
  };

  const getStatusClasses = () => {
    switch (status.type) {
      case 'error':
        return 'bg-red-500/10 text-red-500';
      case 'success':
        return 'bg-green-500/10 text-green-500';
      case 'info':
        return 'bg-blue-500/10 text-blue-500';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-gradient-to-b from-[#2E0249]/70 to-[#570A57]/50 rounded-2xl p-8 backdrop-blur-xl border border-[#7A0BC0]/30">
        <h2 className="text-3xl font-bold text-white mb-6">Mint Your NFT</h2>
        
        {status.message && (
          <div className={`p-4 rounded-lg mb-6 ${getStatusClasses()}`}>
            {status.message}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-white mb-2">Token URI:</label>
            <input
              type="text"
              value={tokenURI}
              onChange={(e) => setTokenURI(e.target.value)}
              placeholder="Enter Token URI (e.g., ipfs://...)"
              className="w-full px-4 py-3 bg-[#2E0249]/50 border border-[#7A0BC0]/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FA58B6]"
              disabled={minting}
            />
          </div>

          <button
            onClick={handleMint}
            disabled={minting || !account}
            className={`
              w-full py-4 rounded-lg font-semibold text-white
              transition-all duration-300
              ${minting || !account
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-[#7A0BC0] hover:bg-[#9D44B5]'
              }
            `}
          >
            {minting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Minting...</span>
              </div>
            ) : !account ? (
              'Connect Wallet to Mint'
            ) : (
              'Mint NFT'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}