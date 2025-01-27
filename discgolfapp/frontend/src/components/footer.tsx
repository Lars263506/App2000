import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center p-4 border-t border-gray-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <a href="/kontakt" className="text-gray-600 hover:underline">
          Kontakt oss
        </a>
        <div className="flex space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="/icons/bxl-facebook-circle.svg" alt="Facebook" className="w-6 h-6" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="/icons/bxl-instagram-alt.svg" alt="Instagram" className="w-6 h-6" />
          </a>
          <a href="https://snapchat.com" target="_blank" rel="noopener noreferrer">
            <img src="/icons/bxl-snapchat.svg" alt="Snapchat" className="w-6 h-6" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="/icons/bxl-twitter.svg" alt="Twitter" className="w-6 h-6" />
          </a>
        </div>
        <a href="/personvern" className="text-gray-600 hover:underline">
          Personvern
        </a>
      </div>
    </footer>
  );
}
