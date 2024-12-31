import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 MintingNFT. Semua hak dilindungi.</p>
        <div className="mt-4">
          <a href="https://twitter.com" className="text-blue-400 mx-2">Twitter</a>
          <a href="https://linkedin.com" className="text-blue-400 mx-2">LinkedIn</a>
          <a href="https://github.com" className="text-blue-400 mx-2">GitHub</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
