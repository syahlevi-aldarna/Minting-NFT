import { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  
  // Gunakan useRef untuk status koneksi
  const isConnecting = useRef(false);

  const updateBalance = useCallback(async (address, currentProvider) => {
    if (!currentProvider || !address) return;
    
    try {
      const balance = await currentProvider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error('Error mengambil saldo:', err);
      setError('Gagal mengambil saldo');
    }
  }, []);

  const handleAccountChange = useCallback(async (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        await updateBalance(accounts[0], web3Provider);
      }
    } else {
      setAccount(null);
      setBalance(null);
    }
  }, [updateBalance]);

  useEffect(() => {
    const initProvider = async () => {
      if (typeof window === 'undefined' || !window.ethereum) return;

      try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        });
        
        if (accounts.length > 0) {
          await handleAccountChange(accounts);
        }
      } catch (err) {
        console.error('Error inisialisasi provider:', err);
        setError('Gagal menginisialisasi wallet');
      }
    };

    initProvider();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountChange);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, [handleAccountChange]);

  const connectWallet = useCallback(async () => {
    if (isConnecting.current) return;
    
    try {
      isConnecting.current = true;
      setLoading(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('MetaMask tidak terinstall!');
      }

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await updateBalance(accounts[0], web3Provider);
      }

    } catch (err) {
      console.error('Error koneksi:', err);
      setError(err.code === 4001 
        ? 'Koneksi ditolak oleh pengguna.' 
        : err.message || 'Gagal menghubungkan wallet');
    } finally {
      setLoading(false);
      isConnecting.current = false;
    }
  }, [updateBalance]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setBalance(null);
  }, []);

  return {
    account,
    balance,
    loading,
    error,
    provider,
    connectWallet,
    disconnectWallet,
    updateBalance
  };
}