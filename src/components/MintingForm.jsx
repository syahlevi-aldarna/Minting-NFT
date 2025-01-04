import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { ethers } from 'ethers';
import { 
  ArrowUpTrayIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export function MintingForm() {
  const { account, provider } = useWallet();
  const [minting, setMinting] = useState(false);
  const [tokenURI, setTokenURI] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [showTutorial, setShowTutorial] = useState(false);

  const contractABI = [
    "function createNFT(string memory tokenURI) public returns (uint256)",
    "function owner() public view returns (address)"
  ];
  const contractAddress = '0x35740E2ca93050D0d8266167bF26B5dBB5F85E2f';

  const handleMint = async () => {
    if (!account) {
      setStatus({ type: 'error', message: 'Silakan hubungkan dompet Anda terlebih dahulu' });
      return;
    }

    if (!tokenURI) {
      setStatus({ type: 'error', message: 'Masukkan URI token yang valid' });
      return;
    }

    try {
      setMinting(true);
      setStatus({ type: 'info', message: 'Memvalidasi metadata...' });
      
      const response = await fetch(tokenURI);
      if (!response.ok) {
        throw new Error('URI Token tidak valid: Tidak dapat mengambil metadata');
      }

      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      setStatus({ type: 'info', message: 'Konfirmasi transaksi di dompet Anda...' });
      
      const transaction = await contract.createNFT(tokenURI);
      setStatus({ type: 'info', message: 'Transaksi terkirim. Menunggu konfirmasi...' });

      const receipt = await transaction.wait();
      
      if (receipt.status === 1) {
        setStatus({ type: 'success', message: 'NFT Berhasil Dibuat!' });
        setTokenURI('');
      } else {
        throw new Error('Transaksi gagal');
      }
    } catch (error) {
      console.error('Minting gagal:', error);
      setStatus({ 
        type: 'error', 
        message: `Gagal membuat NFT: ${error.message || 'Terjadi kesalahan yang tidak diketahui'}`
      });
    } finally {
      setMinting(false);
    }
  };

  const getStatusClasses = () => {
    switch (status.type) {
      case 'error':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'success':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'info':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return '';
    }
  };

  const getStatusIcon = () => {
    switch (status.type) {
      case 'error':
        return <ExclamationCircleIcon className="w-5 h-5" />;
      case 'success':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'info':
        return <InformationCircleIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto" id="minting-section"
    >
      <div className="bg-gradient-to-b from-[#2E0249]/70 to-[#570A57]/50 rounded-2xl p-8 backdrop-blur-xl border border-[#7A0BC0]/30 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Mint NFT Anda</h2>
          <button
            onClick={() => setShowTutorial(!showTutorial)}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            <InformationCircleIcon className="w-6 h-6" />
          </button>
        </div>

        {showTutorial && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-purple-900/30 p-4 rounded-lg mb-6 text-purple-200 text-sm"
          >
            <h3 className="font-semibold mb-2">Cara Minting NFT:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Pastikan dompet crypto Anda terhubung</li>
              <li>Siapkan metadata NFT Anda (gambar, nama, deskripsi)</li>
              <li>Upload metadata ke IPFS dan dapatkan URI-nya</li>
              <li>Paste URI ke form di bawah</li>
              <li>Klik "Mint NFT" dan konfirmasi transaksi</li>
            </ol>
          </motion.div>
        )}
        
        {status.message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg mb-6 border ${getStatusClasses()} flex items-center space-x-2`}
          >
            {getStatusIcon()}
            <span>{status.message}</span>
          </motion.div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-white mb-2 font-medium">Token URI:</label>
            <div className="relative">
              <input
                type="text"
                value={tokenURI}
                onChange={(e) => setTokenURI(e.target.value)}
                placeholder="Masukkan Token URI (mis. ipfs://...)"
                className="w-full px-4 py-3 bg-[#2E0249]/50 border border-[#7A0BC0]/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FA58B6] focus:ring-2 focus:ring-[#FA58B6]/20 transition-all"
                disabled={minting}
              />
              {tokenURI && (
                <button
                  onClick={() => setTokenURI('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleMint}
            disabled={minting || !account}
            className={`
              w-full py-4 rounded-lg font-semibold text-white
              transition-all duration-300 flex items-center justify-center space-x-2
              ${minting || !account
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-[#7A0BC0] hover:bg-[#9D44B5] shadow-lg hover:shadow-purple-500/25'
              }
            `}
          >
            {minting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sedang Minting...</span>
              </>
            ) : !account ? (
              <>
                <ArrowUpTrayIcon className="w-5 h-5" />
                <span>Hubungkan Dompet untuk Mint</span>
              </>
            ) : (
              <>
                <ArrowUpTrayIcon className="w-5 h-5" />
                <span>Mint NFT</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
