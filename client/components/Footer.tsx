import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/20">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <p className="font-semibold text-lg mb-1">Sound.io</p>
            <p className="text-sm text-gray-400">
              © 2025 Sound.io. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
