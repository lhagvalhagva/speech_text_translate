import React from "react";
import { Github, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
          {/* Copyright */}
          <div className="text-center sm:text-left text-xs sm:text-sm order-2 sm:order-1">
            <p>© 2024 Speech to Text.</p>
            <p className="mt-1 sm:mt-0">Бүх эрх хуулиар хамгаалагдсан.</p>
          </div>

          {/* Contact Links */}
          <div className="flex items-center space-x-8 sm:space-x-6 order-1 sm:order-2">
            <a
              href="https://github.com/lhagvalhagva"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition-colors p-2"
              title="GitHub"
            >
              <Github className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100064952799492"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition-colors p-2"
              title="Facebook"
            >
              <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="sr-only">Facebook</span>
            </a>
            <a
              href="mailto:lhagvalhagva@gmail.com"
              className="hover:text-gray-200 transition-colors p-2"
              title="Gmail"
            >
              <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="sr-only">Gmail</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
