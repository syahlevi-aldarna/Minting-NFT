// src/components/WalletButton.jsx
import React from 'react';
import { useWallet } from '../hooks/useWallet';

export function WalletButton() {
  const { account, balance, loading, error, connectWallet, disconnectWallet } = useWallet();

  return (
    <div className="flex flex-col items-end gap-2">
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
      
      {account && (
        <div className="text-sm text-gray-600">
          Balance: {Number(balance).toFixed(4)} ETH
        </div>
      )}

      <button
        onClick={account ? disconnectWallet : connectWallet}
        disabled={loading}
        className={`
          px-4 py-2 rounded-lg font-medium
          transition-all duration-200
          ${loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : account 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }
          text-white disabled:opacity-50
        `}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connecting...
          </div>
        ) : account ? (
          <>Disconnect {account.slice(0, 6)}...{account.slice(-4)}</>
        ) : (
          'Connect Wallet'
        )}
      </button>
    </div>
  );
}