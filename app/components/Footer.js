import React from "react";
import { Github, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-sm">
            © 2024 Speech to Text. Бүх эрх хуулиар хамгаалагдсан.
          </div>

          {/* Contact Links */}
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/lhagvalhagva"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition-colors"
              title="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100064952799492"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition-colors"
              title="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="mailto:lhagvalhagva@gmail.com"
              className="hover:text-gray-200 transition-colors"
              title="Gmail"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
