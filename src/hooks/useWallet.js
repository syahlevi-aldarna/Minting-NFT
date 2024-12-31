// useWallet.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const initProvider = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);

          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });
          
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const balance = await web3Provider.getBalance(accounts[0]);
            setBalance(ethers.utils.formatEther(balance));
          }
        } catch (err) {
          console.error('Error initializing provider:', err);
          setError(err.message);
        }
      }
    };

    initProvider();

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountChange);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []); // Dependency array kosong berarti hanya dipanggil sekali saat mount pertama

  const handleAccountChange = async (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      try {
        if (provider) {
          const balance = await provider.getBalance(accounts[0]);
          setBalance(ethers.utils.formatEther(balance));
        }
      } catch (err) {
        console.error('Error updating balance:', err);
        setError(err.message);
      }
    } else {
      setAccount(null);
      setBalance(null);
    }
  };

  const updateBalance = async (address) => {
    if (provider && address) {
      try {
        const balance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(balance));
      } catch (err) {
        console.error('Error fetching balance:', err);
        setError(err.message);
      }
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('MetaMask tidak terpasang!');
      }

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await updateBalance(accounts[0]);
      }

    } catch (err) {
      console.error('Error connecting:', err);
      setError(err.code === 4001 
        ? 'Koneksi ditolak pengguna.' 
        : err.message || 'Error menghubungkan wallet');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
  };

  return {
    account,
    balance,
    loading,
    error,
    provider,
    connectWallet,
    disconnectWallet,
    updateBalance // Tambahkan fungsi ini ke return object
  };
}
