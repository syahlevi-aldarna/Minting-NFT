import React from 'react';
import { WalletProvider } from './context/WalletContext';
import { WalletButton } from './components/WalletButton';
import { MintingForm } from './components/MintingForm';
import Gallery from './components/Gallery';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-r from-[#2E0249] to-[#570A57]">
        <header className="bg-transparent text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold">NFT Minting App</h1>
            <WalletButton />
          </div>
        </header>
        <HeroSection />
        <main className="p-8">
          <div className="max-w-6xl mx-auto">
            <MintingForm />
            <Gallery />
          </div>
        </main>
        <Footer />
      </div>
    </WalletProvider>
  );
}

export default App;
