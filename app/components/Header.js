import React from "react";
import { Mic } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-2">
          <Mic className="h-6 w-6 text-purple-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Speech to Text
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
          >
            Нүүр
          </a>
          <a
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
          >
            Заавар
          </a>
          <a
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
          >
            Тухай
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
